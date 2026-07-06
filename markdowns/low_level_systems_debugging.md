#* File Name : low_level_systems_debugging.md

# Low-Level Systems & Code Auditing Guide

This guide compiles low-level systems programming concepts, including activation stack frames, CPython runtime bug-fixes, stack corruption, and preloading dynamic linker hacks.

## ELF file– Tentative Symbols (December 14, 2013)
Tentative symbols:
I was messing around with an .o object file and exploring it.
I was having trouble with modifying redis source, and ended up
doing an objdump -t on the object.o.
I noticed an entry ‘bloom ‘ with the section classification as
‘*COM*’.
So what exactly does *COM* section mean in a elf object file?
After googling and traipsing through a list of links,on google page,
and stack overflow  questions, I finally found this meaningful.
Unfortunately, it seems to be a documentation for solaris, or atleast written by the solaris team.
Any case, it’s meaningful. The basic reasoning being if the linker finds any variable at the file scope level,
that is not initialized or declared extern, it assumes that variable is defined in another source file.
And therefore while creating the ELF object file it marks that variable as COMMON blocks.
As it turns out the name COMMON blocks, originated while linking fortran files.
It seems it used to be a common practice in the days of Fortran based program compiling and linking.
9.913986
78.121727

---

## C_learnings from trying to fix cpython bug #8452 (February 14, 2013)
argc passed to a C main function is a special type of variable.
it seems immutable. and not only that it seems like an implicit pointer.
whenever i use it in say memset(ptr,0,argc) it throws me a runtime error
“Use of uninitialised value of size 4”
on the valgrind
Phew,.. i have been trying to moonlight on fixing a cpython bug to add another readline function to the python readline module.
What a task it has been. i have clearly been mis evaluating my C knowledge. While a majority of the language concepts still seem to hold solid, boy my memory of the syntax has been lost.. and perhaps more sadly, my thinking/design thinking has gone so used to python that i just don’t think about types before i use variables… My brain just conveniently ignores them.. damn it.. that’s a bad addiction in general anand….
Anyway, even without all those problems, it turns since i haven’t used gcc, or worked on the cpython code base, it’s  stupid of me to make optimistic time expectations.. that eventually led to frustrations..
Anyway, after what seemed to be 10 days’ amount of work (scattered over 2 months of free time), i have got to the state of getting some of the functions registered with python readline module and being able to call them…. Now time to get on to passing on the variables and functionality checking..
I think it’s a good time to write test cases.. will look into that…
i got the prototype function not found error enough no of times , to look it up finally, and learnt that it is an effect of C standard changes.
in a way to work around/for different C versions(pre-ANSI,post-ANSI,ISO C, etc..), it seems gcc has introduced an option of converting function declarations to the format as prescribed by the given C standard in preprocessor directives. Ofcourse, they don’t try to do it themselves, but allow the C programmer to check of the C-implementation and write a prototype(aka template) of function declarations to convert.
To run the gcc compiler with a strict check use -Wstrict-prototype.
Initial part of this activity was painstaking as i used to either cat and grep or manually search for function defs(based on their names and my guess at what they mean).  But sometime after a couple of days, i came across cscope -R. i now just hit Ctrl-Shift-t and run cscope -R  in the new terminal… I know there’s vim option but am lazy…:). Anyway, thanks to the authors of cscope program.
And now i run into some function called begin_unwind_frame, with cscope’s help i find it is in a file called prot.c and is supposed to be a function from the unwind protect module for bash. Now what the hell is unwind protect module?? I can’t figure from the source code of prot.c what it does, as it seems to use some magic variable ent to set and unset. weary of having to figure out which import header files,contain this variable, i reach for google and end up reading this
instead. Ok that’s interesting but the only way it seems relevant to bash or readline is in ensuring that the file handler  for the std. input stream gets set and released. Oh well then i can ignore it as after all my work is for the python readline module functionality and not even the interpreter’s readline functionality… thankfully.. phew..
Quote from the source code for bash/unwind_prot.c
“/* I can’t stand it anymore!  Please can’t we just write the
whole Unix system in lisp or something? */”
Haha..
After all these diversions and excursions and more learnings and junk, i finally get the code for query_bindings function from bash builtin bind.def source code into cpython readline module and get it to compile and import the module fine.. (Mind it i had to figure out cpython’s method of registering a new function with python module. )So what happens now, when i call the query_bindings function? does it work yet? can i just post the diff and let cpython regular people chirp in and criticize/clean it up? Ofcourse not, it segfaults..
Meh…
well now to do some real work instead of just reacting to the compiler’s yellings and fixing errors.. i.e: to actually understand what that piece of C code does, it seems to involve me reading more linked C code so i have put it off, but can’t avoid it anymore.
turns out readline.h has some conventions. i need to figure out what exactly that keyseqs variable is i.e: the return type of the rl_invoking_keyseqs function… i have to go down the rabbit-hole of C call stack to find out and i forgot what i saw on the way, but it returns keymaps
and what is keymaps? it is a structure with a char and a function pointer(mapped to a readline function). ok that makes sense, now how do i convert this to a string, that too a python string and print it out. Once i convert it to a python string i can just return it and the python interpreter will take care of printing it, so atleast that part of the work doesn’t need to be done.. time to go poking out bash/builtins/bind.def for how it converts the output to a string and prints it..
Ok it turns out keyseqs is really just a pointer to a pointer to character data. So now the question now is how to convert it into a list of strings in python.
9.913986
78.121727

---

## Deep C — activation frames/ stack frames (November 14, 2013)
Ok,
this
‘Deep C programming’ — Slide talk suggests that(slide 136) activation frames and execution stack are two very different concepts in the executable created by compiling and linking a C program.
I was curious and looked up activation frames in C, which led me to
here.
Ofcourse, before i began this journey, I only had heard of stack memory used by a program, and had an understanding that it is one part of the initial memory allocated to the process by the OS, that is used as a stack fashion.(i.e LIFO).
The university of calgary link mixes the terms activation,stack, frame, and execution rather freely. Something’s up. Though first let me try out the example in that Univ. of Calgary link and see what happens.
Here’s the code:, compilation and running it.
#include
void print_facts(int num1, int num2);
int max_of_two(int j, int k);
double avg_of_two(int c, int d);
int main(void)
{
int i;
int j;
/* point  1 */
i = -8;
j = 7;
/* point  2 */
print_facts(i, j);
/* point 10 */
return 0;
}
void print_facts(int num1, int num2)
{
int larger;
double the_avg;
/* point  3 */
larger = max_of_two(num1, num2);
/* point  6 */
the_avg = avg_of_two(num1, num2);
/* point  9 */
printf("For the two integers %d and %d,n", num1, num2);
printf("the larger is %d and the average is %g.n",
larger, the_avg);
}
int max_of_two(int j, int k)
{
/* point  4 */
if (j < k)
j = k;
/* point  5 */
return j;
}
double avg_of_two(int c, int d)
{
double sum;
/* point  7 */
sum = c + d;
/* point  8 */
return (c + d) / 2.0;
}
Compile(make), and run executable:
anand@anand-usb-boot:C [master] $ make activation_record_demo
gcc --std=c99 -g -pedantic -Wall -lm    activation_record_demo.c   -o activation_record_demo
activation_record_demo.c: In function ‘avg_of_two’:
activation_record_demo.c:50:12: warning: variable ‘sum’ set but not used [-Wunused-but-set-variable]
anand@anand-usb-boot:C [master] $ ./activation_record_demo
For the tow integers -8 and 7,
the larger is 7 and the average is -0.5.
Now comes the fun part: We need to be able to examine the  stack, during the execution of the program.
GDB to the
rescue.
Here’s the gdb session i went through:
anand@anand-usb-boot:C [master] $ gdb64 ./activation_record_demo
GNU gdb (GDB) 7.5.91.20130417-cvs-ubuntu
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
For bug reporting instructions, please see:
...
Reading symbols from /home/anand/workspace/github_stuff_public/Miscellaneous/C/activation_record_demo...done.
(gdb) b 11
Breakpoint 1 at 0x400534: file activation_record_demo.c, line 11.
(gdb) run
Starting program: /home/anand/workspace/github_stuff_public/Miscellaneous/C/activation_record_demo
Breakpoint 1, main () at activation_record_demo.c:12
12	    i = -8;
(gdb) frame
#0  main () at activation_record_demo.c:12
12	    i = -8;
(gdb) n
13	    j = 7;
(gdb) n
16	    print_facts(i,j);
(gdb) frame
#0  main () at activation_record_demo.c:16
16	    print_facts(i,j);
(gdb) s
print_facts (num1=-8, num2=7) at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) frame
#0  print_facts (num1=-8, num2=7) at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) s
max_of_two (j=-8, k=7) at activation_record_demo.c:42
42	    if (j < k)
(gdb) frame
#0  max_of_two (j=-8, k=7) at activation_record_demo.c:42
42	    if (j < k)
(gdb) frame 0
#0  max_of_two (j=-8, k=7) at activation_record_demo.c:42
42	    if (j < k)
(gdb) frame
#0  max_of_two (j=-8, k=7) at activation_record_demo.c:42
42	    if (j < k)
(gdb) down
Bottom (innermost) frame selected; you cannot go down.
(gdb) s
43	        j = k;
(gdb) s
45	    return j;
(gdb) s
46	}
(gdb) s
print_facts (num1=-8, num2=7) at activation_record_demo.c:31
31	    the_avg = avg_of_two(num1,num2);
(gdb) s
avg_of_two (c=-8, d=7) at activation_record_demo.c:52
52	    sum = c + d;
(gdb) s
54	    return (c+d) / 2.0;
(gdb) frame
#0  avg_of_two (c=-8, d=7) at activation_record_demo.c:54
54	    return (c+d) / 2.0;
(gdb) s
55	}
(gdb) s
print_facts (num1=-8, num2=7) at activation_record_demo.c:34
34	    printf("For the tow integers %d and %d, n",num1,num2);
(gdb) n
For the tow integers -8 and 7,
35	    printf("the larger is %d and the average is %g. n",larger,the_avg);
(gdb) n
the larger is 7 and the average is -0.5.
37	}
(gdb) c
Continuing.
[Inferior 1 (process 24420) exited normally]
(gdb) run
Starting program: /home/anand/workspace/github_stuff_public/Miscellaneous/C/activation_record_demo
warning: no loadable sections found in added symbol-file system-supplied DSO at 0x7ffff7ffa000
Breakpoint 1, main () at activation_record_demo.c:12
12	    i = -8;
(gdb) s
13	    j = 7;
(gdb) s
16	    print_facts(i,j);
(gdb) frame
#0  main () at activation_record_demo.c:16
16	    print_facts(i,j);
(gdb) s
print_facts (num1=-8, num2=7) at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) frame
#0  print_facts (num1=-8, num2=7) at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) info frame
Stack level 0, frame at 0x7fffffffddb0:
rip = 0x400566 in print_facts (activation_record_demo.c:28);
saved rip 0x400551
called by frame at 0x7fffffffddd0
source language c.
Arglist at 0x7fffffffdda0, args: num1=-8, num2=7
Locals at 0x7fffffffdda0, Previous frame's sp is 0x7fffffffddb0
Saved registers:
rbp at 0x7fffffffdda0, rip at 0x7fffffffdda8
(gdb) s
max_of_two (j=-8, k=7) at activation_record_demo.c:42
42	    if (j < k)
(gdb) s
43	        j = k;
(gdb) s
45	    return j;
(gdb) info frame
Stack level 0, frame at 0x7fffffffdd80:
rip = 0x4005e6 in max_of_two (activation_record_demo.c:45);
saved rip 0x400575
called by frame at 0x7fffffffddb0
source language c.
Arglist at 0x7fffffffdd70, args: j=7, k=7
Locals at 0x7fffffffdd70, Previous frame's sp is 0x7fffffffdd80
Saved registers:
rbp at 0x7fffffffdd70, rip at 0x7fffffffdd78
(gdb) frame
#0  max_of_two (j=7, k=7) at activation_record_demo.c:45
45	    return j;
(gdb) up
#1  0x0000000000400575 in print_facts (num1=-8, num2=7)
at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) frame
#1  0x0000000000400575 in print_facts (num1=-8, num2=7)
at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) info frame
Stack level 1, frame at 0x7fffffffddb0:
rip = 0x400575 in print_facts (activation_record_demo.c:28);
saved rip 0x400551
called by frame at 0x7fffffffddd0, caller of frame at 0x7fffffffdd80
source language c.
Arglist at 0x7fffffffdda0, args: num1=-8, num2=7
Locals at 0x7fffffffdda0, Previous frame's sp is 0x7fffffffddb0
Saved registers:
rbp at 0x7fffffffdda0, rip at 0x7fffffffdda8
(gdb) up
#2  0x0000000000400551 in main () at activation_record_demo.c:16
16	    print_facts(i,j);
(gdb) info frame
Stack level 2, frame at 0x7fffffffddd0:
rip = 0x400551 in main (activation_record_demo.c:16);
saved rip 0x7ffff7a33ea5
caller of frame at 0x7fffffffddb0
source language c.
Arglist at 0x7fffffffddc0, args:
Locals at 0x7fffffffddc0, Previous frame's sp is 0x7fffffffddd0
Saved registers:
rbp at 0x7fffffffddc0, rip at 0x7fffffffddc8
(gdb) down
#1  0x0000000000400575 in print_facts (num1=-8, num2=7)
at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) down
#0  max_of_two (j=7, k=7) at activation_record_demo.c:45
45	    return j;
(gdb) down
Bottom (innermost) frame selected; you cannot go down.
(gdb) s
46	}
(gdb) s
print_facts (num1=-8, num2=7) at activation_record_demo.c:31
31	    the_avg = avg_of_two(num1,num2);
(gdb) n
34	    printf("For the tow integers %d and %d, n",num1,num2);
(gdb) n
For the tow integers -8 and 7,
35	    printf("the larger is %d and the average is %g. n",larger,the_avg);
(gdb) n
the larger is 7 and the average is -0.5.
37	}
(gdb) c
Continuing.
Note the output of the frame commands.
It print a number followed by an address, followed by the caller function, and the source code file and line no.
The next line prints out the actual source code at that line.
Interestingly look at the address differences when i move up the stack using up/down.
For ex:
(gdb) info frame
Stack level 0, frame at 0x7fffffffdd80:
rip = 0x4005e6 in max_of_two (activation_record_demo.c:45);
saved rip 0x400575
called by frame at 0x7fffffffddb0
source language c.
Arglist at 0x7fffffffdd70, args: j=7, k=7
Locals at 0x7fffffffdd70, Previous frame's sp is 0x7fffffffdd80
Saved registers:
rbp at 0x7fffffffdd70, rip at 0x7fffffffdd78
(gdb) frame
#0  max_of_two (j=7, k=7) at activation_record_demo.c:45
45	    return j;
(gdb) up
#1  0x0000000000400575 in print_facts (num1=-8, num2=7)
at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
(gdb) frame
#1  0x0000000000400575 in print_facts (num1=-8, num2=7)
at activation_record_demo.c:28
28	    larger = max_of_two(num1,num2);
Here, i move up the stack twice. The stack address which originally was at
0x7fffffffdd80
moves to
0x0000000000400575
, At first look it seems bizarre, till you realize there’s a return and the first stack address located function returns.
9.913986
78.121727

---

## C Arch patterns (November 3, 2014)
There are some patterns you can see in C code.
Mostly signs that give off indications of what are the data structures used.
For example, this is a code from cpython source(Include/object.h):(obfuscated for illustrative purposes)
typedef struct XXX {
struct XXX *nnn;
const char* string;
PyObject *object;
} XXX;
The sign here is that the struct name (XXX here) is used, within the
struct definition for another element. In this case, this element is a pointer to the self. This indicates this is a linked list.
It can be a circular linked list or singly linked list with the last node pointing to NULL. That distinction can be guessed with initial values. Given it’s not being initialized, I would guess this is a circular linked list, but to verify I will have to check parts of the code where this struct is initialized.
On the contrary, if I had needed this to be a doubly linked list instead, I would have defined it this way instead.
typedef struct XXX {
struct XXX *ppp;
struct XXX *nnn;
const char* string;
} XXX;
The point being two pointers to the same structure, but this does not necessarily mean there’s a doubly linked list implementation. If someone’s trying to write Obfuscated C code, they might use this struct but use it differently, on purpose to hinder code readability.
Oh, by the way, this could also be made into a binary-tree structure by manipulating the insertions into *ppp, *nnn, as new structs. In case of making this a binary tree, we would need a check to make sure no new object linked to *nnn(and *ppp) is already in the structure. Infact it would be more apt naming those *left and *right than *ppp, *nnn.
i.e:
typedef struct XXX {
struct XXX *left;
struct XXX *right;
const char* nodelabel;
} XXX;
Note purely in terms of the type of elements composing/constituting the struct, there’s no difference between this and the above doubly linked list. However, the difference will arise out of how these struct pointers are inserted.
#TODO: CODE SAMPLE HERE.
Now, I’ll graduate to the next data structure, I believe is logically next, (and is one of my favourite) data structure — Graphs.
Linked lists, are simply a very specific case of a graph(which can be called a specific case of sets).
Linked lists are simply graphs restricted to only one edge,(directed) between any two nodes.
Ofcourse, am assuming planar graph<link>,(i.e: one edge can only connect two nodes) and not hyper-graph<link>(think nodes in 3D, and edges that can connect more than “2 nodes”.)
So, Opencog<link> is a open-source attempt to create an Artificial General Intelligence system.
At the core of it is a hypergraph<link to why hypergraphs>(aka atomspace).
Note: this is a C++ project.
Here’s the code for defining an atom:
class Atom
: public std::enable_shared_from_this<Atom>
{
friend class ::AtomUTest; // Needs to call setFlag()
friend class AtomTable; // Needs to call MarkedForRemoval()
friend class ImportanceIndex; // Needs to call setFlag()
friend class Handle; // Needs to view _uuid
friend class SavingLoading; // Needs to set _uuid
friend class TLB; // Needs to view _uuid
private:
//! Sets the AtomTable in which this Atom is inserted.
void setAtomTable(AtomTable *);
//! Returns the AtomTable in which this Atom is inserted.
AtomTable *getAtomTable() const { return _atomTable; }
protected:
UUID _uuid;
AtomTable *_atomTable;
Type _type;
char _flags;
TruthValuePtr _truthValue;
AttentionValuePtr _attentionValue;
// Lock needed to serialize AV changes.
// Just right now, we will use a single shared mutex for all
// locking. If this causes too much contention, then we can
// fall back to a non-global lock, at the cost of 40 additional
// bytes per atom.
static std::mutex _avmtx;
static std::mutex _mtx;
/**
* Constructor for this class.
*
* @param The type of the atom.
* @param Outgoing set of the atom, that is, the set of atoms this
* atom references. It must be an empty vector if the atom is a node.
* @param The truthValue of the atom. note: This is not cloned as
* in setTruthValue.
*/
Atom(Type, TruthValuePtr = TruthValue::NULL_TV(),
AttentionValuePtr = AttentionValue::DEFAULT_AV());
struct InSet
{
// incoming set is not tracked by garbage collector,
// to avoid cyclic references.
// std::set<ptr> uses 48 bytes (per atom).
IncomingSet _iset;
// Some people want to know if the incoming set has changed...
AtomPairSignal _addAtomSignal;
AtomPairSignal _removeAtomSignal;
};
typedef std::shared_ptr<InSet> InSetPtr;
InSetPtr _incoming_set;
void keep_incoming_set();
void drop_incoming_set();
// Insert and remove links from the incoming set.
void insert_atom(LinkPtr);
void remove_atom(LinkPtr);
private:
/** Returns whether this atom is marked for removal.
*
* @return Whether this atom is marked for removal.
*/
bool isMarkedForRemoval() const;
/** Returns an atom flag.
* A byte represents all flags. Each bit is one of them.
*
* @param An int indicating which of the flags will be returned.
* @return A boolean indicating if that flag is set or not.
*/
bool getFlag(int) const;
/** Changes the value of the given flag.
*
* @param An int indicating which of the flags will be set.
* @param A boolean indicating the new value of the flag.
*/
void setFlag(int, bool);
//! Marks the atom for removal.
void markForRemoval();
//! Unsets removal flag.
void unsetRemovalFlag();
public:
virtual ~Atom();
/** Returns the type of the atom.
*
* @return The type of the atom.
*/
inline Type getType() const { return _type; }
/** Returns the handle of the atom.
*
* @return The handle of the atom.
*/
inline Handle getHandle() {
return Handle(shared_from_this());
}
/** Returns the AttentionValue object of the atom.
*
* @return The const reference to the AttentionValue object
* of the atom.
*/
AttentionValuePtr getAttentionValue() const { return _attentionValue; }
//! Sets the AttentionValue object of the atom.
void setAttentionValue(AttentionValuePtr) throw (RuntimeException);
/** Returns the TruthValue object of the atom.
*
* @return The const referent to the TruthValue object of the atom.
*/
TruthValuePtr getTruthValue() const { return _truthValue; }
//! Sets the TruthValue object of the atom.
void setTruthValue(TruthValuePtr);
void setTruthValue(CompositeTruthValuePtr ctv) {
setTruthValue(std::static_pointer_cast<TruthValue>(ctv));
}
//! Return the incoming set of this atom.
IncomingSet getIncomingSet() const;
/** Returns a string representation of the node.
*
* @return A string representation of the node.
*/
virtual std::string toString(std::string indent = "") const = 0;
virtual std::string toShortString(std::string indent = "") const = 0;
/** Returns whether two atoms are equal.
*
* @return true if the atoms are equal, false otherwise.
*/
virtual bool operator==(const Atom&) const = 0;
/** Returns whether two atoms are different.
*
* @return true if the atoms are different, false otherwise.
*/
virtual bool operator!=(const Atom&) const = 0;
};
Whoa, C++, reputation of being verbose and fearsome is justified, i think. Now let’s break this down.
# TODO: EXPLAIN THE STRUCT
Let’s now check one of my favourite project redis, And a data structure/algorithm that fascinates me. The hyperloglog, HLL
struct hllhdr {
char magic[4]; /* "HYLL" */
uint8_t encoding; /* HLL_DENSE or HLL_SPARSE. */
uint8_t notused[3]; /* Reserved for future use, must be zero. */
uint8_t card[8]; /* Cached cardinality, little endian. */
uint8_t registers[]; /* Data bytes. */
};
Now this looks simple, and some of you might think it’s deceptively simple.(Don’t it’s straight forward simple). The real magic is actually in how these values are computed. There’s a reason HLL is called an algorithm and not considered a data structure.
#TODO: MORE ELABORATION

---

## How to debug a corrupted stack (October 13, 2013)
Interview questions
Is your stacktrace really corrupted?
by
Salvatore Iovene
on 17 October 2006 — Posted in
Howtos
,
Coding
,
Articles
You may encounter, during your debugging sessions, the `stack corruption’ problem. Usually you will find it out after seeing your program run into a segmentation fault. Otherwise, it must mean that some very malicious and subtle code has been injected into your program, usually through a buffer overrun. What is a buffer overrun? Let’s examine the following short C code:
#include <stdio.h>
void bar(char* str) {
char buf[4];
strcpy( buf, str );
}
void foo() {
printf("Hello from foo!");
}
int main(void) {
bar("This string definitely is too long, sorry!");
foo();
return 0;
}
There’s clearly something wrong with it: as you can see, we are copying `str’ to `buf’ without first checking the size of `str’. First of all there is a security issue, because if `str’ didn’t just…
View original post
1,036 more words

---
