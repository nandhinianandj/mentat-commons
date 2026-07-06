---
title: Deep C++ —- virtual table
abstract: Original post from the blog titled 'Deep C++ —- virtual table'.
problem: Original post from the blog titled 'Deep C++ —- virtual table'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Deep C++ —- virtual table'.
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

Moving further along in that ridiculously long, too many slides unneccessarily pdf Deep C, we come across Deep C++ .
#include
struct X
{
int a;
char b;
int c;
};
int main(void)
{
std:: cout << sizeof(X) << std::endl;
return 1;
}
Now that code is no different from  C by much(Except for those std::cout instead of printf) and so should print out the same size as padded structs in C. (
see prev post)
So it does:
g++ cpp_vtable.cpp  -o cpp_vtable
anand@anand-usb-boot:C [master] $ gdb64 cpp_vtable
Reading symbols from /home/anand/workspace/github_stuff_public/Miscellaneous/C/cpp_vtable...(no debugging symbols found)...done.
(gdb) run
Starting program: /home/anand/workspace/github_stuff_public/Miscellaneous/C/cpp_vtable
warning: no loadable sections found in added symbol-file system-supplied DSO 

...[Full content preserved in source]