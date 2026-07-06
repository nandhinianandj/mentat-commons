#* File Name : systems_optimization_playbook.md

# Production Database & Performance Tuning Checklist

This checklist consolidates performance profiling notes, including Pandas operations, Linux networking TCP parameters, NUMA swap insanity configurations, and PyPy compilation tunings.

## Linux networking tcp keep alive settings (April 13, 2014)
We at our company started having regular server downtime for 3-4 days exactly around our peak load timeperiod.(i.e: around 2 pm IST). Now debugging it was turning into a hard issue due to the fact that we have a fairly(above average?) level of complexity in our application. Not to mention, we have so far resisted or avoided fiddling with linux server internal configurations.*
But this time, it turned out to be unavoidable. So to stick to the original evolution of the storypoint, first response on looking at our dashboard  of all possible signals,
is hey look that jserr also seems to have gone up around the sametime.  Not to mention our email boxes get flooded with, critical error in websocket server messages. On a look at the logs of websocket server we see messages like “”.
We also see a clear spike in auth login failure graph. So first preventive action after first day of down time is to spin up more login servers.
So we decide that the websocket servers get flooded too much during peak load, so we will spin up more servers.
Result on the next day, we still have same spike and down time, but only 1 hr later.
Ok, clearly that more login servers helped, but was not the core cause nor did it completely eradicate the problem. Time to setup deeper investigation tools. First attempt was to stay up around till the peak load time, and run sar -A close to the times.
While that showed up high paging faults, and context switches, it was not clear what was the cause.
Besides, staying up and monitoring actively led to proactively  restarting some of the servers/processes that seem to have stopped the peak load and downtime.
But 4-5 hrs later than the usual, the servers did go down again.
About a week or so before this, we had decided mongod was causing too much paging and for our usage, it is not a good choice for a backend memory application, and we should  move most of our data to redis, especially chat rooms and messages.
So we had started work on it and were testing the changes to migrate to redis around this time. So we decided accelerate the testing and release on this and pooled efforts together.
Result, we had a good solid working copy of code that uses redis to create new rooms, nad messages and send, and distribute them.
so we went ahead and deployed them, but discovered that our code to migrate old and existing rooms was taking quite a long time, due to a whole lot of old private rooms ** present.
But this deploy seemed to have gone stable on the production and for a change we went for about 30 hrs time period without a server down time. But then saturday early morning it went down again.
This time, a colleague noticed that there’s a whole lot of tcp open sockets/connections that are in SYN_RECV state. i.e: output of netstat -atn had a whole lot of connections in that state.
So, I started reading around about what exactly this state means. I end up reading
this
,
this
and
this
.
Based on my understanding of this
http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/usingkeepalive.html
, our current tcpkeepalive settings on kings’ landing consider a connection dead only after 2 hrs 11 minutes . (7200 + 75* 9 seconds)
each of those 3 values can be configure in
# echo 600 > /proc/sys/net/ipv4/tcp_keepalive_time
# echo 60 > /proc/sys/net/ipv4/tcp_keepalive_intvl
# echo 20 > /proc/sys/net/ipv4/tcp_keepalive_probes
Files respectively.
I am changing the first tcp_keepalive_time to 600. It means the number of seconds of no packet activity on a socket before sending a tcp_keepalive packet to check if it’s alive. ..
By doing this, dead connections will be detected in 21 minutues of inactivity( 600 + 75*9 seconds).
One of the downsides of this is if someone opens up a chat room starts typing but hits send only after 21 minutes, the client side app will have to reacquire a connection.
Basic hypothesis:
Dead connections/ inactive app clients are being cleaned up after 2 hrs and 11 minutes. But there’s a limit on how many sockets our server can handle/provide/keep active. so during peak load it runs out of sockets to distribute.
Assumptions that may fail:
1. The app client is sensible to reconnect/reacquire a connection before sending( or atleast if there’s a inactivity time gap before send).
Prediction:
We shouldn’t have a server failure at peak loads. Infact we currently see a failure/sudden drop at 25 messages/5s(or whatever x-axis that graphite shows).
But after this change, we should see our messaging rate peak go up, without sudden drop.
Undo Action:
To undo these changes just run
# echo 7200 > /proc/sys/net/ipv4/tcp_keepalive_time
* — The core reason simply being we would like to scale our app, to 100x or more of current times, and poking around kernel parameters, and configurations makes it harder to leverage the power of cloud and instant instance creations etc.. (though with ec2’s tagging etc.. may not be all that hard)
** — Private messages to another user or to a group chat.
9.913986
78.121727

---

## Python’s Weak Performance Matters (February 7, 2018)
Meta Rabbit
Here is an
argument I used to make
, but now disagree with:
Just to add another perspective, I find many “performance” problems in
the real world can often be attributed to factors other than the raw
speed of the CPython interpreter. Yes, I’d love it if the interpreter
were faster, but in my experience a lot of other things dominate. At
least they do provide low hanging fruit to attack first.
[…]
But there’s something else that’s very important to consider, which
rarely comes up in these discussions, and that’s the developer’s
productivity and programming experience.[…]
This is often undervalued, but shouldn’t be! Moore’s Law doesn’t apply
to humans, and you can’t effectively or cost efficiently scale up by
throwing more bodies at a project. Python is one of the best languages
(and ecosystems!) that make the development experience fun, high
quality, and very efficient.
(from Barry Warsaw)
I…
View original post
705 more words

---

## pypy compilation error (July 1, 2013)
Am trying to compile pypy on my core i7 3632 QM machine with 4GB of memory. But i run into pdb with an error “can’t allocate memory” Am running a ubuntu 13.04 with the latest updates. Here’s the error stack below..
[platform:execute] gcc /tmp/usession-default-1/platcheck_56.o -pthread -lrt -lrt -o /tmp/usession-default-1/platcheck_56
[platform:execute] gcc -c -O3 -pthread -fomit-frame-pointer -Wall -Wno-unused /tmp/usession-default-1/platcheck_57.c -o /tmp/usession-default-1/platcheck_57.o
[platform:execute] gcc /tmp/usession-default-1/platcheck_57.o -pthread -lrt -lrt -o /tmp/usession-default-1/platcheck_57
[751b] translation-task}
[Timer] Timings:
[Timer] annotate                       — 287.2 s
[Timer] ==========================================
[Timer] Total:                         — 287.2 s
[translation:ERROR] Error:
[translation:ERROR]  Traceback (most recent call last):
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/goal/translate.py”, line 317, in main
[translation:ERROR]     drv.proceed(goals)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/driver.py”, line 733, in proceed
[translation:ERROR]     return self._execute(goals, task_skip = self._maybe_skip())
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/tool/taskengine.py”, line 114, in _execute
[translation:ERROR]     res = self._do(goal, taskcallable, *args, **kwds)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/driver.py”, line 284, in _do
[translation:ERROR]     res = func()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/driver.py”, line 321, in task_annotate
[translation:ERROR]     s = annotator.build_types(self.entry_point, self.inputtypes)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 93, in build_types
[translation:ERROR]     return self.build_graph_types(flowgraph, inputcells, complete_now=complete_now)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 149, in build_graph_types
[translation:ERROR]     self.complete()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 203, in complete
[translation:ERROR]     self.complete_pending_blocks()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 198, in complete_pending_blocks
[translation:ERROR]     self.processblock(graph, block)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 348, in processblock
[translation:ERROR]     self.flowin(graph, block)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 412, in flowin
[translation:ERROR]     self.consider_op(block, i)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 606, in consider_op
[translation:ERROR]     resultcell = consider_meth(*argcells)
[translation:ERROR]    File “<4318-codegen /home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py:646>”, line 3, in consider_op_getattr
[translation:ERROR]     return arg.getattr(*args)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/unaryop.py”, line 724, in getattr
[translation:ERROR]     return bookkeeper.pbc_getattr(pbc, s_attr)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/bookkeeper.py”, line 605, in pbc_getattr
[translation:ERROR]     return first.s_read_attribute(attr)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/description.py”, line 974, in s_read_attribute
[translation:ERROR]     return self.bookkeeper.immutablevalue(value)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/bookkeeper.py”, line 396, in immutablevalue
[translation:ERROR]     result.dictdef.generalize_value(self.immutablevalue(ev))
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/bookkeeper.py”, line 477, in immutablevalue
[translation:ERROR]     x._cleanup_()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/interpreter/mixedmodule.py”, line 123, in _cleanup_
[translation:ERROR]     self.getdict(self.space)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/interpreter/mixedmodule.py”, line 116, in getdict
[translation:ERROR]     w_value = self.get(name)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/interpreter/mixedmodule.py”, line 69, in get
[translation:ERROR]     w_value = self.getdictvalue(space, name)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/interpreter/mixedmodule.py”, line 81, in getdictvalue
[translation:ERROR]     return self._load_lazily(space, name)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/interpreter/mixedmodule.py”, line 91, in _load_lazily
[translation:ERROR]     w_value = loader(space)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/interpreter/mixedmodule.py”, line 190, in ifileloader
[translation:ERROR]     value = eval(spec, d)
[translation:ERROR]    File “<string>”, line 1, in <module>
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/pypy/module/pyexpat/interp_pyexpat.py”, line 405, in get_expat_version
[translation:ERROR]     return space.wrap(rffi.charp2str(XML_ExpatVersion()))
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/rtyper/lltypesystem/rffi.py”, line 243, in wrapper
[translation:ERROR]     res = call_external_function(*real_args)
[translation:ERROR]    File “<518-codegen /home/anand/playspace/languages/python/pypy/rpython/rtyper/lltypesystem/rffi.py:169>”, line 6, in call_external_function
[translation:ERROR]     res = funcptr()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/rtyper/lltypesystem/lltype.py”, line 1291, in __call__
[translation:ERROR]     return callb(*args)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/rtyper/lltypesystem/ll2ctypes.py”, line 1208, in __call__
[translation:ERROR]     cfunc = get_ctypes_callable(self.funcptr, self.calling_conv)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/rtyper/lltypesystem/ll2ctypes.py”, line 1140, in get_ctypes_callable
[translation:ERROR]     libpath = ctypes.util.find_library(libname)
[translation:ERROR]    File “/usr/lib/python2.7/ctypes/util.py”, line 253, in find_library
[translation:ERROR]     return _findSoname_ldconfig(name) or _get_soname(_findLib_gcc(name))
[translation:ERROR]    File “/usr/lib/python2.7/ctypes/util.py”, line 242, in _findSoname_ldconfig
[translation:ERROR]     f = os.popen(‘/sbin/ldconfig -p 2>/dev/null’)
[translation:ERROR]  OSError: [Errno 12] Cannot allocate memory
[translation:ERROR] Processing block:
[translation:ERROR]  block@3 is a <class ‘rpython.flowspace.flowcontext.SpamBlock’>
[translation:ERROR]  in (pypy.module.imp.interp_imp:155)is_builtin
[translation:ERROR]  containing the following operations:
[translation:ERROR]        v45 = getattr(space_2, (‘str0_w’))
[translation:ERROR]        v46 = simple_call(v45, w_name_0)
[translation:ERROR]        v44 = getattr(space_2, (‘builtin_modules’))
[translation:ERROR]        v47 = contains(v44, v46)
[translation:ERROR]        v48 = is_true(v47)
[translation:ERROR]  –end–
[translation] start debugger…
> /usr/lib/python2.7/ctypes/util.py(242)_findSoname_ldconfig()
-> f = os.popen(‘/sbin/ldconfig -p 2>/dev/null’)
Looks like it is time to dig around and understand the pypy architecture.. Phew i was hoping to avoid that at the first run.. oh well as always it nothing is ever as simple as it seems.. :P
UPDATE 3 July 2013 00:53 AM
Hypothesis 1: i have been running my OS from a pendrive with misconfigured swap partition. Time to edit and fix /etc/fstab and reboot to test.
UPDATE 12 July 2013 19:37 PM
OK that lack of swap partition was the problem. I was able to compile pypy successfully. See details below:
I am using a Dell inspiron with core i7 3rd Gen. processor and 4 GB RAM.
time python rpython/bin/rpython pypy/goal/targetpypystandalone.py
[Timer] Timings:
[Timer] annotate                       —  421.1 s
[Timer] rtype_lltype                   — 1713.8 s
[Timer] backendopt_lltype              —  193.7 s
[Timer] stackcheckinsertion_lltype     —  150.8 s
[Timer] database_c                     —  213.1 s
[Timer] source_c                       —  404.4 s
[Timer] compile_c                      —  397.8 s
[Timer] ===========================================
[Timer] Total:                         — 3494.7 s
real	59m48.626s
user	51m37.880s
sys	0m4.224s
Time try out the other target numpy. And then may be i can try my hand at creating a new target, perhaps scikit-learn?? We’ll see if i am up to that task
UPDATE: 12 July 19:42 PM
Hmm numpy fails with the python rpython. some signature mismatch.. Here’s the error stack
[Timer] Timings:
[Timer] annotate                       — 2.0 s
[Timer] ========================================
[Timer] Total:                         — 2.0 s
[translation:ERROR] Error:
[translation:ERROR]  Traceback (most recent call last):
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/goal/translate.py”, line 321, in main
[translation:ERROR]     drv.proceed(goals)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/driver.py”, line 732, in proceed
[translation:ERROR]     return self._execute(goals, task_skip = self._maybe_skip())
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/tool/taskengine.py”, line 114, in _execute
[translation:ERROR]     res = self._do(goal, taskcallable, *args, **kwds)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/driver.py”, line 283, in _do
[translation:ERROR]     res = func()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/translator/driver.py”, line 320, in task_annotate
[translation:ERROR]     s = annotator.build_types(self.entry_point, self.inputtypes)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 93, in build_types
[translation:ERROR]     return self.build_graph_types(flowgraph, inputcells, complete_now=complete_now)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 149, in build_graph_types
[translation:ERROR]     self.complete()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 203, in complete
[translation:ERROR]     self.complete_pending_blocks()
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 198, in complete_pending_blocks
[translation:ERROR]     self.processblock(graph, block)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 348, in processblock
[translation:ERROR]     self.flowin(graph, block)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 412, in flowin
[translation:ERROR]     self.consider_op(block, i)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/annrpython.py”, line 606, in consider_op
[translation:ERROR]     resultcell = consider_meth(*argcells)
[translation:ERROR]    File “”, line 3, in consider_op_simple_call
[translation:ERROR]     return arg.simple_call(*args)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/unaryop.py”, line 155, in simple_call
[translation:ERROR]     return obj.call(getbookkeeper().build_args(“simple_call”, args_s))
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/unaryop.py”, line 737, in call
[translation:ERROR]     return bookkeeper.pbc_call(pbc, args)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/bookkeeper.py”, line 669, in pbc_call
[translation:ERROR]     results.append(desc.pycall(schedule, args, s_previous_result, op))
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/description.py”, line 297, in pycall
[translation:ERROR]     inputcells = self.parse_arguments(args)
[translation:ERROR]    File “/home/anand/playspace/languages/python/pypy/rpython/annotator/description.py”, line 265, in parse_arguments
[translation:ERROR]     (self.name, e.getmsg()))
[translation:ERROR]  TypeError: (‘signature mismatch: numpy_compile() takes exactly 1 argument (2 given)’, <
[translation:ERROR] Occurred processing the following simple_call:
[translation:ERROR]       (KeyError getting at the binding!)
[translation:ERROR]  v2 = simple_call((function numpy_compile), v0, v1)
[translation:ERROR] In :
[translation:ERROR] Happened at file pypy/goal/targetnumpystandalone.py line 36
[translation:ERROR]
[translation:ERROR] ==>     a = numpy_compile(bc, size)
[translation:ERROR]         a = a.compute()
[translation:ERROR]
[translation:ERROR] Known variable annotations:
[translation:ERROR]  v0 = SomeString(no_nul=True)
[translation:ERROR]  v1 = SomeInteger(knowntype=int, nonneg=False, unsigned=False)>)
[translation:ERROR] Processing block:
[translation:ERROR]  block@39 is a
[translation:ERROR]  in (targetnumpystandalone:33)main
[translation:ERROR]  containing the following operations:
[translation:ERROR]        v2 = simple_call((function numpy_compile), v0, v1)
[translation:ERROR]        v3 = getattr(v2, (‘compute’))
[translation:ERROR]        v4 = simple_call(v3)
[translation:ERROR]  –end–
[translation] start debugger…

---

## HTTP protocol.. RFC study notes (May 24, 2016)
Alright, I sholud have done this atleast 2 years ago and was too much of an idiot to not do this, better late than never.
Study Notes — http protocol (RFC 7230 – 7235)*
RFC 7230 — Message syntax and Routing
Key parties:
1. HTTP Server: the sytem that responds to http requets with http responses
2. User Agent/http client: the system that sends the http requests
Intermediaries:
There are some intermediate parties in the communication between 1 and 2. (Because of how tcp/ip works).
Note: these are relevant because, some of the keywords are related to these. (aka, this is where the http vs tcp/ip abstraction leaks)
1. proxy:
message-forwarding agent selected by client(via configurable rules),
commonly used to group an organizations’ requests
2. gateway:
an intermediary that acts as origin(http) server for a outbound connection but translates the requests and forwards them inbound to other servers.
3. tunnel:
Tunnel is a blind relay between 2 connections, that passes on messages. it differs from gateway, but not translating the requests, but blindly passing them on. Generally used in situations like TLS + https secure communication via a firewall proxy
Caches:
Details in RFC 7234.
1. Local store of previous response messages
2. A response may or may not be cached based on :
a, cacheable flag is set.
b, A set of constraints defined in rfc7234
Versioning:
A Message has atleast these fields:
Version is .
HTTP-version = HTTP-name “/” DIGIT “.” DIGIT
HTTP-name = %x48.54.54.50 ; “HTTP”, case-sensitive
Major version denotes http messaging syntax, while minor version is the client’s communication capabilities.
Hmm.. these two don’t seem well-defined so far in the rfc.
My guess is the major version corresponds to tell the server which protocol-specific syntax, (ie: http/https/ftp/etc.) to connect with the server is used for the request.
While minor version is which version client understands, so the response can be formatted in a compatible manner.
My guess about major num is wrong.
The intention of HTTP’s versioning design is that the major number
will only be incremented if an incompatible message syntax is
introduced, and that the minor number will only be incremented when
changes made to the protocol have the effect of adding to the message
semantics or implying additional capabilities of the sender.
However, the minor version was not incremented for the changes
introduced between [RFC2068] and [RFC2616], and this revision has
specifically avoided any such changes to the protocol.
Uniform Resource Identifiers:
1. identifies resources
For the URI syntax, I’ll just quote from the links on the rfc.
URI-reference =
absolute-URI =
relative-part =
scheme =
authority =
uri-host =
port =
path-abempty =
segment =
query =
fragment =
absolute-path = 1*( “/” segment )
partial-URI = relative-part [ “?” query ]
http URI Scheme:
* — Original RFC was 2616
http://ift.tt/1qWngNQ
, but it was superseded by these.
from HTTP protocol.. RFC study notes
from Tumblr
http://ift.tt/1TJ1z20
via IFTTT
from HTTP protocol.. RFC study notes
from Tumblr
http://ift.tt/1YUABVk
via IFTTT
from HTTP protocol.. RFC study notes
from Tumblr
http://ift.tt/1RmDqIV
via
IFTTT

---

## Pandas Data Frame performance (November 29, 2015)
I ran into this interesting thing at work.
Pandas.read_csv
has this option called skiprows to skip some records.
Now, quite accidentally(silly mistake) i initially ran it with sampleSize=3000 value instead of len(file) – sampleSize:
I was trying to compare it against reading the whole file, and then using random.sample and dataframe.iloc on top of the dataframe object.
So this was the loading time.
— skiprows: 0.426070928574
random.sample: 1.00320601463
Of course in this case the comparisons are meaningless as the output dataframe lengths are different (sampleSize in one case and len(file)-sampleSize in another)
At this point I had a hunch that skiprows, may not be fast, even if it takes less memory (RAM), because it is basically Hard Disk seek(s)(or seeks depending how the pandas implementation is. i.e: clubbed together skip contiguous rows — makes sense, or random skips  )
So let’s the stats after finding file size(with a wc ) and then employing skiprows.
Note so far I’m using
python’s timeit module
, which essentially runs the program so many times and returns average time taken. these were all for 300 runs.
. — skiprows: 1.80713701248
— random.sample 0.965622901917
Voila, now the skiprows shoots up to  dobule that of random.sample.. previously it was 0.42 now it is 1.8.
Ok .. at this point am beginning to suspect, pandas might deliberately issue multiple seek calls for skipping rows instead of simply skipping rows contiguously.. Now how do we find out?
Option 1: Patiently dig through
panda’s
source code and find out.(Not a bad idea, as I’m so far impressed by pandas’ ability to handle files with 7Million records)
Option 2: See if you can get more detailed/low-level profiling on the python program*. Enter
hotshot.
Here’s the output of running that hotshot module with the same code I had used for pandas.
119821 function calls (115989 primitive calls) in 0.373 seconds
Ordered by: internal time, call count
List reduced from 2228 to 40 due to restriction
ncalls  tottime  percall  cumtime  percall filename:lineno(function)
44    0.011    0.000    0.017    0.000 zipfile.py:803(_RealGetContents)
705/187    0.011    0.000    0.024    0.000 sre_parse.py:388(_parse)
18    0.009    0.001    0.010    0.001 collections.py:288(namedtuple)
2    0.008    0.004    0.373    0.187 __init__.py:4()
22    0.008    0.000    0.091    0.004 __init__.py:1()
1381/169    0.007    0.000    0.014    0.000 sre_compile.py:64(_compile)
273    0.006    0.000    0.007    0.000 function_base.py:2945(add_newdoc)
4194    0.006    0.000    0.006    0.000 posixpath.py:68(join)
566    0.005    0.000    0.019    0.000 pkg_resources.py:1888(find_on_path)
423    0.005    0.000    0.018    0.000 pkgutil.py:176(find_module)
575    0.005    0.000    0.007    0.000 __init__.py:79(open_resource)
1    0.005    0.005    0.006    0.006 numeric.py:1()
8130    0.005    0.000    0.005    0.000 sre_parse.py:191(__next)
2281    0.005    0.000    0.006    0.000 posixpath.py:139(islink)
1    0.005    0.005    0.005    0.005 socket.py:45()
1    0.005    0.005    0.007    0.007 _lxml.py:2()
1    0.004    0.004    0.005    0.005 polynomial.py:55()
1    0.004    0.004    0.005    0.005 legendre.py:83()
537    0.004    0.000    0.005    0.000 sre_compile.py:256(_optimize_charset)
6    0.004    0.001    0.005    0.001 string.py:148(substitute)
1    0.004    0.004    0.005    0.005 hermite_e.py:59()
1    0.004    0.004    0.005    0.005 chebyshev.py:87()
1    0.004    0.004    0.005    0.005 hermite.py:59()
1    0.004    0.004    0.005    0.005 laguerre.py:59()
1    0.004    0.004    0.006    0.006 util.py:214(_findSoname_ldconfig)
233    0.004    0.000    0.005    0.000 pkg_resources.py:2494(insert_on)
1942/760    0.004    0.000    0.004    0.000 sre_parse.py:149(getwidth)
464    0.003    0.000    0.011    0.000 posixpath.py:387(_joinrealpath)
538    0.003    0.000    0.010    0.000 pkg_resources.py:2294(from_location)
1    0.003    0.003    0.025    0.025 __init__.py:101()
4    0.003    0.001    0.158    0.039 api.py:3()
2196    0.003    0.000    0.003    0.000 zipfile.py:287(__init__)
5775    0.003    0.000    0.003    0.000 sre_parse.py:139(__getitem__)
1441    0.003    0.000    0.049    0.000 re.py:230(_compile)
687    0.003    0.000    0.003    0.000 genericpath.py:15(exists)
3    0.003    0.001    0.011    0.004 __init__.py:9()
1    0.002    0.002    0.004    0.004 machar.py:113(_do_init)
6804    0.002    0.000    0.006    0.000 sre_parse.py:210(get)
377/358    0.002    0.000    0.003    0.000 :1()
1    0.002    0.002    0.003    0.003 groupby.py:3136(DataFrameGroupBy)
481 function calls in 0.004 seconds
Ordered by: internal time, call count
List reduced from 138 to 40 due to restriction
ncalls  tottime  percall  cumtime  percall filename:lineno(function)
1    0.002    0.002    0.002    0.002 parsers.py:1148(read)
1    0.000    0.000    0.000    0.000 random.py:293(sample)
1    0.000    0.000    0.000    0.000 parsers.py:1040(__init__)
14    0.000    0.000    0.000    0.000 numeric.py:392(asarray)
2    0.000    0.000    0.000    0.000 internals.py:2296(_rebuild_blknos_and_blklocs)
4    0.000    0.000    0.000    0.000 common.py:731(take_nd)
1    0.000    0.000    0.004    0.004 pandasPerfTest.py:18(readCsvWrandom)
4    0.000    0.000    0.000    0.000 internals.py:3743(_stack_arrays)
3    0.000    0.000    0.000    0.000 index.py:123(__new__)
1    0.000    0.000    0.000    0.000 indexing.py:1388(_is_valid_list_like)
1    0.000    0.000    0.000    0.000 index.py:896(__getitem__)
7    0.000    0.000    0.000    0.000 _methods.py:31(_any)
9    0.000    0.000    0.000    0.000 index.py:4471(_ensure_index)
1    0.000    0.000    0.000    0.000 internals.py:3585(form_blocks)
1    0.000    0.000    0.000    0.000 numeric.py:462(asanyarray)
8    0.000    0.000    0.000    0.000 internals.py:63(__init__)
7    0.000    0.000    0.000    0.000 index.py:882(__contains__)
7    0.000    0.000    0.000    0.000 series.py:2561(_sanitize_array)
4    0.000    0.000    0.000    0.000 numeric.py:586(require)
3    0.000    0.000    0.000    0.000 common.py:1978(_possibly_infer_to_datetimelike)
8    0.000    0.000    0.000    0.000 internals.py:2094(make_block)
1    0.000    0.000    0.000    0.000 frame.py:4692(extract_index)
1    0.000    0.000    0.003    0.003 parsers.py:221(_read)
1    0.000    0.000    0.000    0.000 _methods.py:27(_prod)
21    0.000    0.000    0.000    0.000 common.py:59(_check)
1    0.000    0.000    0.001    0.001 indexing.py:1441(_getitem_axis)
4    0.000    0.000    0.000    0.000 internals.py:850(take_nd)
1    0.000    0.000    0.003    0.003 parsers.py:329(parser_f)
1    0.000    0.000    0.000    0.000 indexing.py:1688(_maybe_convert_indices)
2    0.000    0.000    0.000    0.000 common.py:2275(_asarray_tuplesafe)
1    0.000    0.000    0.000    0.000 internals.py:3295(take)
1    0.000    0.000    0.000    0.000 index.py:973(take)
1    0.000    0.000    0.000    0.000 _methods.py:15(_amax)
1    0.000    0.000    0.001    0.001 generic.py:1304(take)
2    0.000    0.000    0.000    0.000 common.py:1903(_possibly_cast_to_datetime)
2    0.000    0.000    0.000    0.000 internals.py:3709(_multi_blockify)
8    0.000    0.000    0.000    0.000 internals.py:140(mgr_locs)
7    0.000    0.000    0.000    0.000 internals.py:2242(shape)
2    0.000    0.000    0.000    0.000 internals.py:2201(__init__)
2    0.000    0.000    0.000    0.000 internals.py:2422(_verify_integrity)
1.80713701248
0.965622901917
Whoa there, what is this, how do I make sense of this. and how is this going to help. Well, to begin with, am being lazy, to read through pandas source, so just trying out random/easy stuff. This may not help at all. second of all, this doesn’t seem to give/create resolution at the C function level at all, so if you need that take a hike  or try something more low level.
* — All code used for this blog can be found
here.

---

## NUMA- linux tuning — this is humbling level of complexity (October 10, 2013)
This
is the processor i have on my laptop. I followed up with this hypothesis and ran numactl –hardware which gives me this output:
available: 1 nodes (0)
node 0 cpus: 0 1 2 3 4 5 6 7
node 0 size: 3971 MB
node 0 free: 634 MB
node distances:
node   0
0:  10
A view at cat /proc/cpuinfo gives me this
processor	: 6
vendor_id	: GenuineIntel
cpu family	: 6
model		: 58
model name	: Intel(R) Core(TM) i7-3632QM CPU @ 2.20GHz
stepping	: 9
microcode	: 0x
OK, so looking up the processor points me to this
http://ark.intel.com/products/71670/Intel-Core-i7-3632QM-Processor-6M-Cache-up-to-3_20-GHz-BGA
. Unfortunately that link mentions nothing about the actual architecture involved. Am left to guess that it’s because i have only 4G RAM (all allocated to one node) or my processor just does not belong in the category i thought it does.
Damn it. it’s time figure out this hypothesis. Time to look for other ways to test this.
This
link
suggests that mine does come under Ivy-bridge, but something called Ivy bridge(Mobile). Ivy bridge is the successor architecture after SandyBridge. That means i was right about the architecture (if only in terms of direction) and the next test is to add RAM and then see if numactl gives a better output. I have a feeling there might be more to this problem than meets the eye.(Like Linux installation time default ubuntu kernel does not have numa optimization or something like that .., but we’ll see. only one way to find out.)
This
is a problem i have faced before, though on a different vps hosted server(64G RAM)
These are some other interesting links
http://frosty-postgres.blogspot.com/2012/08/postgresql-numa-and-zone-reclaim-mode.html
http://engineering.linkedin.com/performance/optimizing-linux-memory-management-low-latency-high-throughput-databases
http://lwn.net/Articles/254445/
9.913986
78.121727

---

## The MySQL “swap insanity” problem and the effects of the NUMA architecture (October 10, 2013)
Jeremy Cole
Update
: Also read
A brief update on NUMA and MySQL
.
The “swap insanity” problem, in brief
When running MySQL on a large system (e.g., 64GB RAM and dual quad core CPUs) with a large InnoDB buffer pool (e.g., 48GB), over time, Linux decides to swap out potentially large amounts of memory, despite appearing
1
to be under no real memory pressure.  Monitoring reveals that at no time is the system in actual need of more memory than it has available; and memory isn’t leaking,
mysqld
‘s
RSS
is normal and stable.
Normally a tiny bit of swap usage could be OK (we’re really concerned about activity—swaps in and out), but in many cases, “real” useful memory is being swapped: primarily parts of InnoDB’s buffer pool. When it’s needed once again, a big performance hit is taken to swap it back in, causing random delays in random queries. This…
View original post
3,035 more words

---
