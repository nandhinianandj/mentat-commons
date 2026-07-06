---
title: http requests — a few steps involved.
abstract: Original post from the blog titled 'http requests — a few steps involved.'.
problem: Original post from the blog titled 'http requests — a few steps involved.'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'http requests — a few steps involved.'.
lessons: Refer to post content for technical insights.
related_articles: []
related_projects: []
related_skills: []
related_talks: []
career_axes:
- axis-i
reading_time: 2 mins
evidence_links:
- https://softwaremechanic.wordpress.com/
tags:
- Archive
featured: false
---

First off, this post is more of a personal note than attempt to explain to anyone or an attempt to capture every detail.It was triggered by a monitoring script failing and passing from different systems.
If you would get accurate information, go
here
and
here
. Or just google anatomy of a http request.
these are the steps:
1.Namespace lookup to the DNS Server (a,request to DNS Server for the hostname’s ip address;b,DNS Server replies with ip address)
2.Establish a tcp connection with the server at that ip address
a,Client sends a SYN packet*
b,Server sends back a SYN-ACK packet
c,Client sends a ACK packet, establishing TCP connection
3.Send the HTTP request to the server
4.Wait for the server’s response
5.Web server processes the request, finds the resource, and sends the response to the C

...[Full content preserved in source]