# I built my own interface for Claude. It only reads my folder.

- **Video:** https://www.youtube.com/watch?v=OOL7ILbiLdU
- **Ondertitel-taal:** en
- **Bron:** YouTube-ondertitels

---

I showed you on this channel already
so many things you can do with AI that is actually useful, and
how we organize everything using just a local folder and Claude. And today, I will show you something
I've been thinking about for, well, a whole year to how to best work with
AI, so whatever it creates for me, I don't have to sit in a session to keep
control of it, keep tracking what it's doing, and then follow up the chat,
and then go through the chat and find the things, and all this is confusing. And in order to compensate that and
make it clearer if I work on different things in parallel, inside our folder,
I have already a deliverables folder. In this one, the AI will create
subfolders, and this will contain any things that we create, like images,
reports, diagrams, whatever that you generate with AI will land there. But this is obviously messy, okay? So this is a demo folder I'm showing here. That's not my real work, but I will
show you my real work in a moment. The thing is, at least I have a
single source of truth where I find the work in progress stuff from AI. Now, if you're working with Cowork,
you will have a long chat again, and they at least organize this on the
side, progress and outputs, and then you have here the context and skills. But the thing is, this is
still not enough to me. I can comment on these things, that's
great, and I can follow up on things. So that's a minimalistic UI that goes
into the right direction, but it is still not enough for me to keep control of very
complex tasks that I'm working on with AI. And, And in code, we also have some
ways to look into this a bit more. We have artifact section, and then
we have a background task where I see an overview of the things
that ran and all these things. But again, to me, this is living
inside an app that I have no control over, and I wanted to customize it to
properly work with AI, but with any AI. And that's the point about this
local folder approach that we have. It has all the instructions how AI
should work, and I can point anything at this folder, no matter if it is
Claude or later on Codex or Gemini or any other model that you want to use. It will still work inside this
folder, and I made ven- many videos about how this works in the past. This video today is all about how I work
with AI to keep track of the things that we've been working on and make it much
more efficient to work asynchronously. So I can actually follow up on decisions
that I have to take without the need to sit on my computer all the time, because
I think that's a big time sink, and that makes you less productive sitting
at the computer waiting for the AI to reply and then follow up in chat, this
is just-- it's just annoying for me. All right? So the way we can work, as I showed
previously, we can open up this folder inside  Cowork or inside Claude Code,
and we can perfectly work in there. What I prefer to do is using the terminal,
if you're new to this, don't be scared. It's very straightforward using
the terminal because in fact it's just an interface that it is not
as fancy as the Claude desktop application, but it works the same way. So I can, who are you? And he says, "I'm Larry, your team
orchestrator." And he says this because I launched this session inside
the folder, the same way as I-- if I would open this inside Claude Desktop,
and it would say the same thing. So the way I prefer to
work is using VS Code. VS Code is a free application
that was used coders in the past. I'm a non-coder, so all you see here
was just built by me talking to my PK and the agents that I have in here. So you can download this folder for
free inside the membership and get started building something that I
show you later in the video yourself. And I do this by using VS Studio Code. So you can download this for free, And
it's an IDE, as it is called, and it's looks more complicated than it is. So what I have here, it's
again, a terminal session that I launched Claude in. So when we go to top, so you see
here there's Claude working in there. You can even launch a nicer
version of Claude in here too. But I prefer the raw version because
I can style it the way I want it, and that's called a harness, okay? So it's running inside a specific harness,
that's provided by Claude, and the Claude model is running inside this harness. And I can adjust it because instead
of having the long form chat inside Claude Desktop, I started then to
introduce things like this, okay? Summaries that are visually represented by
emojis, or when I have to make a decision to give me a short code snippet, ask me
what decision I should, uh, decide on. And I was able then to follow up later
because the thing is I kept scrolling and things and missing out, and
therefore, I had now these decisions. And that's something if you go to the
AI enhancement hub inside, the myICOR application, there you have these prompts
that you can copy-paste And that's the one here, that's the decision warning system,
and it AI will just set this up for you so you can have  these things appearing too. To me, it was a visual indicator instead
of a wall of text where there were hidden decisions in there that I had to make. I was now visually seeing
what I need to decide on to unblock the AI to keep working. And as there are also sub-agents
working, many things going on in parallel, I lost more and more track
of all the things that I decided on that was going on throughout the thing. So it came back now with these summaries
as well, where I was able now to see this in a more narrow version, easy
to digest now, to go through these things that showed me then, you know,
uh, the ask and what it answered And so on, all right? So this was working fine, but as you
can see, I have several sessions open there, and I keep them often open
several days because there's much more complex work going on that just, you
know, create my diagram or report that might need several days to work on. So I'm forced to actually have
several sessions working on, and I keep track of this by having
the deliverables folder, okay? Here's a deliverables folder. It's the same thing that you saw on the
desktop, but this is my personal one now. And you see there are still a lot of
deliver- deliverables open, uh, from the past days that are not completed yet. And if you open up the archive, you see
all the things that I worked on that I worked on for months before, okay? All the way back to February, and then
I introduced the, the deliverables folder, and that's where I kept working. So all the things are there to
have a track record of the things. Maybe I need to look up
something later and so on. So the beautiful thing that we always
say is that these folders are perfect because I can open up any of these,
click on them, and read the content. I have covers, and I look at this, okay? I can review it this way. But it is, again, a folder structure. I don't know what to look at. I need to read what, uh, AI is asking me
inside the chat And then I always have to look up, okay, what is asked in the chat? Where do I find this in the deliverables? Find the deliverable. Obviously, I can ask AI to open it for
me and show it, and that's what I did. I told AI, " Create a HTML page, open it
up in Chrome, show it to me." All right? So there are, there are examples Like this Trend Hop, for
example, I can, Open this in a browser, and it looks like this. this is the folder that you see here. That's the HTML. I double-click, it opens up in Chrome,
and now I can read the report, and it's much more visually pleasing,
but it's still a lot to consume. And the issue is there's
no way to act on it. If I saw anything that I thought
is interesting, I can copy-paste this back into the chat, but
then I have to follow up. I always need to explain
myself what this is all about. And this is a lot of back and forth that
consumes so much time, in my opinion, and it's such, such a waste of time. And that's why I went
the next step forward. while I was building on this over
months, different iterations. It's not something that I worked on
for a year and now I completed my work. It is an iteration going through
many, many, many different versions of how I could integrate this to work
better with AI, but still using just a local folder and keep everything
accessible as we have it in here, right? So I don't want to have a proper
application in this sense that is on the web and, and use database or
whatnot and build complex things. I wanted to have everything integrated,
and this is my solution here. And this is what I came up with, and this
is work in progress, uh, but I wanted to share the work in progress with you. I'm happy to get your feedback in the
comments what you think about this, and be sure this is just one part of
a much bigger release that we will do later, But here is one of the essential
parts of what this will contain. And again, all this was built
just using this local folder. And as you can see here, this is
actually the session I worked on inside my own PK folder to build this, okay? So you can do this yourself
if you invest the time, if you know the structure and all this. If you want to skip ahead with
the time, bear with me because this will become available for
our inner circle members soon too So what is this? This is the list of deliverables,
and you see it's already presented completely different than the
folders that we saw previously. Here I have images. If I hover, I get additional
information what is going on. I see things that are waiting on me. I see there are two open-- on this
one, for example, there are two open decisions I have to make. If I click on it, this is
the, the context, okay? That's a video I'm working on, and there's
a script for the video, and here's the script, and that's the thing, okay? I wanted to review a script, and
there was always back and forth. There was no way to edit things because
it was inside the chat or inside a deliver-deliverab-deliverables folder. And if I made edits, it was not tracked. This changed now because I
have here an update section. You see this. It shows what was worked on. I see an audit trail, what changed
inside the deliverables, and if there's any media, we get to
this, uh, it will show here too. And here are the decisions. So I can close this one. Now I have only focus on this
one deliverable I'm working on, and here it asks me about certain
things it needs feedback on about this, it's direct context to this. I also see there's one that I already
answered, and I can even create notes for AI to follow up later. So you see that becomes very
complex, and yet I can act on anything on this deliverable. So this goes much further
because  this-- many times it's confusing what AI actually wants. I want to explain it more, but
then many things go in parallel, and I ha-- it's messed up, okay? So I can go into focus mode, and I
see what I need to do here, and then I can call Larry, my orchestrator
And you see it's opening up here Yeah. So, um, I'm on the decision C1X. Can you explain a bit more about
what I need to decide on this? Not this one. Snuck in and wrote a four-sentence
draft into three files, script.md, the HTML All right, I stop this here
because I know what this is all about. And the thing is, um, you see I am
able to talk to Larry, my orchestrator, who has the understanding of what is
going on and give me more context. Now, where is this now? Well, if you scroll down,
here's the call recordings. So Even the recording what we talked
about ends up on this deliverable. So there's even more context
available for AI later on to catch up. Even if I lose any live session
inside a terminal, it's still able to pick up where we left off because it
has all this context, and only this context, so it knows where to work on. And now you see here the trail. You see there was a call. Everything is tracked. And again, it's all running
in this local folder. There's no, uh, external database or
anything That's not a web application. it's just accessing my local folder. And I will show you in a moment how
this works behind the scenes and how it's possible to make this work. But you see now I have a complete
different way to progress through things. I can add a comment to the decision,
and I can agree on something that is recommended, or I don't agree,
or I want to work on this later. And I even can say decide all,
which just opens up all the open decisions that I can walk through. So here's the decision I have to make,
and here's the context of the deliverable. There's the title of the deliverable. And again, I can just call Larry if
I'm unsure what this is all about to catch me up or give me a different
perspective quickly instead of writing and instantly, as you have seen, He
directly responds instead of writing it into the terminal, waiting for a reply,
and have something mid-session talking about that messes the whole flow up. So I have different threads, and I
have different focus on what I can discuss, and it makes it also for AI
later on much easier to understand what this is all about we are talking here I want to show you another example
because I pushed this a lot further. So if we go, for example, to this
to this inline diagrams, okay? Especially if AI generates for me images. This is really interesting
for me to review. so the goal here in this deliverable
was to convert images that I generated with  AI, uh, in this case chatGPT,
but also NanoBanana, all these things. Instead of using an AI image generator,
I wanted to use just code so that  AI or Claude uses just code to create
these images instead of using expensive tokens on any image generators. Because what I wanted to have are
these, you know, images like this. They are very simplistic, and I thought
this is possible th- through code, and this is the proof of concept. That's the deliverable,
what's this all about. So just so you get an understanding what
you're looking at here, and here I want to show you more details what happens
when I start working on these things. You see here on the side already the
update panel where you see the crew, okay? I see the agents who worked on this, how
many times a session ran with different agents working on my deliverable. I see an audit trail where they
write down what they did and what they changed and the decisions they
made, and this is all instantly. So where does this happen? Currently, it still happens
inside a terminal that I talk to. This would also work in Cowork and in
Claude Code on a Claude desktop, because again, it's just manipulating your folder
locally, and these updates get just represented this way on the browser. That's it. It's just looking into the folder
and gives me now these numbers, and there are instructions for AI
what it needs to keep track of for me to have the most information. Here I have a media panel. I see all the media that got generated. I have the audit trail, as I said. But  here I have also a
timeline of the things. If I click, I see exactly what happened
on this timeline and, uh- how things moved forward, and I can even open
up all these things to see all the different steps in the timeline. This is here the explanation of
what's going on, where it's standing. It updates this live. Whenever I change, ch- change
things, it's updating And the goal was to give me a comparison of the
AI-generated image versus the end v- version that is generated via code. And you see here, for example, I click
on it, it perfectly now replicates my AI-generated image with just using code. That's so much cheaper than generating
this via AI, and it's much more flexible because now I can animate these things,
and build them up and many things. Nothing for this video, but
that's now possible with this. That's why it w- I was so keen about it. But I want to show you this because
you see on top already there is a draw, and I can actually click on
this and start drawing and mentioning things, you know, like this. And I-- you see four strokes attached. I can now add a comment, and now
I can save the comment, and this is the follow-up comment with
this context drawn on the image. And this is insane because now I
can directly comment on the image, and then it's sitting there. So how does this work? Next time AI picks up the changes,
and it just works through the comments and d- decisions that I made
and starts working on it and then comes back with new instructions. So it's really an asynchronous work,
but I can be sure that I can just work through everything that is
open and then keep moving forward. But I have the full context
available all the time. You see, for example, this one, so
the previous one didn't look correct. And I can now resolve this
comment, and that's it. There are no open comments anymore. So I also told it to make a
video out of it, and here you go. It's an empty thing, but if you click
on it, it is an-- it's an actual video it, and you see everything is animated There are only three ways out of my
inbox, and nothing leaves without a decision So you see that's fully animated And, you know, it's perfectly working now. So now the beauty here with video
is I can annotate the video too. So you see there's one stroke attached
at this timestamp, and now I can add a comment here and save the comment
at this timestamp, which tells AI, " Look at this specific frame,
and then read my comment because there we need to change something." And that's amazing because this is
how I can perfectly now explain going through all the diff- deliverables
and check out what we are at and what needs to be ch- changed. Here again, you see there are
open decisions for me and yeah, that's what this is all about. I can even ask the team,
which opens a new deliverable. In fact, it goes into the team inbox
for those who don't know about my PK. If you go into the folder, we have the
deliverables where we see the output of the AI that we are working with, but
there's also team inbox, so I can throw anything in here that the team should
look at, and it picks it up from there. And that's again, this structure and
instructions that we already have in place, I'm leveraging now here to actually
create new tasks, and it just ends up in a team inbox for AI being picked up later. Something that will come to this that I
want to have is also the live session. So there's actually an ongoing thread of
a conversation that is over all the thing. As you can see, it tracks already
the session IDs that are local. But before we go on, I want
to show you something else. Again, you remember the thing that I
showed you previously is that I wanted to comment directly on something that
I see right now, the moment I see it. So in this case, I can just
select and comment, and I leave a comment on this section. Or this thing on the side, you can just,
you know, hover over it and click on it, and now I'm commenting on this specific
section, and it knows it by the HTML element to, in order to work on this. So this is also an amazing way now for
me to just say, " Well, I disagree on this one, and I can comment on this." another thing is, let's see if
there's anything in this one. No. But here you see down there, there
are additional files that are relevant for this deliverable, and I can click
on it, and it opens up this MD file in a formatted way for me to review
if I want to, and even to comment on too, uh, no matter what it is. Also here, a TXT file and so on. So that's the supportive, information. And here's what I requested in the
beginning, and I shared in the beginning just two references they should look
at, which is this one that was AI generated, to use to create these images. So that's one example of many,
because you see there are all these open deliverables that I showed you
already in VS Code, and I now just by the images instantly know what this
is all about and what to look at. And, uh, going back to this video I
want to show you here, I can actually go now directly in here and make changes,
and those changes are again tracked. I'm not doing it right now, but those
are tracked in the audit trail, so AI knows that I changed something. I can even add additional content
in between, and I can obviously also select and comment on specific parts. But previously, I only was able
to select and then comment at best, but not manipulate the
content that was produced by AI. And now we are really collaborating on
these outcomes directly without ever opening or searching anything inside
this folder and try to find it there. So very quickly in the end, I want to show
you how all this works behind the scenes. So we had the de- deliverables inbox,
and in there it created these folders already where we had the outcome. All right? The image that I wa- asked for, the
script I was asking for, many things. And now it created a new thing. So that's obviously not my own. That's the demo one that
doesn't contain this yet. But here we go Here's the SVG only incline
diagrams, no image model. Okay? Again, let's open this in comparison. this is the one that we
just had open here, okay? So finding this in this list is already
tedious, but then opening it up and trying now to find these images, you
know, like here, and then make sense of it, what is the latest version? Because you see all the images are here. Everything is in this local folder for me
to review, and previously it was pointing me at these images and ask me questions. And if I didn't follow up or the
session broke down, I lost this context. No more, because each folder
is now structured this way. It has a canvas JSON, which in fact is
just holding any conversation that I had previously, the decisions made, all this. This is where it gets
updated live in here. There's a brief, when a new session
starts inside a folder, it knows where to look at, what this is
all about, this specific folder. So I'm leveraging this Claude.md approach,
the file that is usually inside a folder explaining AI what this is all about. In each deliverable, there is
such file for each different things that got decided. And here we see, uh, the examples. We see the decisions all
made also in markdown. So you see the decisions I made
are also showing in markdown, all readable, and this is about it. So the tool itself that I built is
living here in this expansions folder. I have here the session canvas, and
this is the tool that you just saw, and I'm literally opening up this folder
on video here for the first time. I didn't look at it at all. I just talked to AI to keep building
this and to refining things. And, uh, the more experience you
have with building apps this way, the better you know how to do these things. But it makes no sense to me, you know,
to go in there and check any files. But this is the thing
that is running, okay? So you see it's all working
inside this one folder. In the expansion folder, I have this tiny
app that it created that now just pulls the data from my deliverables and serves
it on the front end in a browser this way. It l- maybe looks a lot more polished
because I'm training my team for, well, nearly a year now to learn
how to code, what design branding. All these things are set in our Inside this team knowledge, you know,
guidelines, SOPs, and all these things. Again, I didn't write
these instructions for AI. AI did it for itself based on the
work that we did together in the past. It keeps improving itself over and
over, and that's the big difference. If you're using a chatbot, you will
never reach this point that I'm showing you here on this level. But also using this local folder approach,
it keeps you completely independent. The only thing you need to back
up is this folder to be sure that you don't lose the things. But you point any AI on this, and it
will work out of the box because it understands the content of this folder,
and that's what we provide for free. It's this basic scaffold that, explains
AI how this folder works, and you can start working out of the box. I made many videos about this. If you haven't watched it yet, I
recommend you to watch this one next. And if you want to see what the end
result of my building here is and how you can access it, Subscribe to
the channel so I can catch you up in the next video, or join us for free
inside myICOR where you stay up to date about all these new releases too So I see you over there
