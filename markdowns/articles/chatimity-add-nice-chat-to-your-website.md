---
title: chatimity add nice chat to your website.
abstract: Integration guide for embedding the Chatimity widget (async JS script loading)
  in Tumblr blogs.
problem: Integration guide for embedding the Chatimity widget (async JS script loading)
  in Tumblr blogs.
context: Legacy Wordpress blog post reference.
key_ideas:
- Integration guide for embedding the Chatimity widget (async JS script loading) in
  Tumblr blogs.
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

Here’s how to add a widget of Chatimity( a place where all the nice people hang around chatting) to your tumblr blog:
Tumblr:
1. Login to  your Tumblr Dashboard.
2. Click on customize button (on the right hand column, below posts).
3. You’ll now be on a page which shows your theme with a left hand column.
4. On the left hand top, you’ll see a edit html link below your theme, click on that.
5. You’ll now have an editor open on the left column, this is your base template, hit Ctrl+F and type   This is a html tag, just below this paste the following text.
(function() {
var e = document.createElement('script'); e.type = 'text/javascript'; e.async = true;
e.src = 'https://secure.chatimity.com/chat.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
}());
Cl

...[Full content preserved in source]