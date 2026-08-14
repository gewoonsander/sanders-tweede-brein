# I switched off Claude's memory. My folder does it better.

- **Video:** https://www.youtube.com/watch?v=p79T9P2WmTI
- **Ondertitel-taal:** en
- **Bron:** YouTube-ondertitels

---

I'm making this video because I'm sure
I'm not alone with this when it comes to Persistent Memory And having a consistent
outcome using AI if your AI seems to keep forgetting, you keep reminding it all the
time about the things that you said it already a hundred times, this video is for
you, and we will dive into my own setup to show you That I'm struggling with the
same things that you might do, and what solution I have to the problem to overcome
these things Let's start at the beginning, because I don't know where you are at. So my main AI that I'm using is Claude,
And if you're using the Claude desktop or in a browser, this is what it looks like. And on the side, there might
be a long list of different chat sessions that you had. that I also had in chatGPT back in
the times where I tried to find the chats that I was working in, in order
to find things that I looked up. This was a- already something that we
overcame by not relying on the sessions themselves as the source and the things
that we store information, But extract whatever was the outcome and then
move it into the final destination, the note-taking app that we used the
project management tool and so on. Now, this changed in the beginning
of the year when we started using a local folder approach. And here's my local folder, and what
this is, there is a folder called PKM, personal knowledge management, and here
is all the things that I store related to my life and to my professional work. But there's also instructions for AI
how to work with me when they work with me, and this means there's a
team knowledge folder, and in here there are guidelines, there are
SOPs, standard operating procedures, and there are also work streams. So we have recurring work, uh, that
we do together that we can look at. How does this work in practice? Well, I can always right-click in here
and just start a new terminal at the folder and launch Claude this way. And now I can just start talking to
my folder or inside Claude Desktop, I can use Cowork and open the folder
this way and start working with it. Or use Claude Code in here, which is, a
visually more pleasing experience that you might have with the terminal, and
I can start talking to my folder here. Anyway, no matter how I access this
folder, it will always pick up these guidelines and how it should act in here,
and that's the magic behind the myPKM system that we are using, that out of
the box, you can download this for free. You have the basic instructions
for your team, how to act in there. And there is an orchestrator agent  the
single point of contact, that when you say, " "Who are you?" in here He looks into the folder and he says,
"I'm Larry, your team orchestrator, my PKA." And then he starts telling me that
he has specialists he can work with. And that's the magic behind this, because
now I have different agents that do specialized work for me that I handed
over to the team that I iterated on, that I worked with them already, like content
creation, website building, support ticket handling, many things that I do
with the team that doesn't get lost in the void because many people still using
chat or even Cowork, and they start a session, they work in this, and then
the next day they start a new session and they wonder why it keeps forgetting. Even that Claude claims that they have
now This memory here where you see it search and references previous chats
and it generates memory from chats and, uh, you see I have them switched off
because I find them not reliable enough because this is Looking up and extracting
information in the way that Claude thinks it makes sense, but not the way that I
want to provide the information to my AI. So the way it works inside the folder
is that everything that gets created in here are markdown files, and you might
have heard of this approach already, the wiki approach from Kaparthy,
where he uses wiki links in there. And that's, um, essentially the basic
of it, where any journal entry, anything that gets created is a file, and
it's interlinked with each other And I could open this now, for example,
in Obsidian or other tools to show that or build my own applications. And I, in fact, did
this for team knowledge. I just told the team, " Build an
interface that shows me team knowledge. And here we go. This is the interface now that just
hooks into my folder, and it shows me the team knowledge this way. So I can click actually on the
guideline, and it shows me what agent is responsible for it. And, uh, let's see. If I search for video, there we go. Video publishing guideline,
and here it is open. You see all the responsible agents,
and here's the work stream, what they work according to, and the cross-linked
SOPs, and I can open them up. And That's no special app. You can build these things just
asking AI to represent your folder content in the best way possible. Obviously, my AI team has over a year of
experience building things like this with me, and that's the key about persistent
memory, where they write things down in these documentations that they can
refer to in the future whenever you want to build something or work, do some
work that you do on a recurring basis. And those, uh, of you using Obsidian might
be familiar with this view, where you actually can see the interconnections. So here, for example, Charter,
one of my agents, she's involved in these, uh, work streams. And when I click on the work stream,
I see how they are connected to other work streams and SOPs and so on. But all this, as you can see, becomes
really overwhelming when we look at this standard operating procedures. I have a hundred eleven, I have
forty-three work streams, and I have seventy-two guidelines, and
this seems to me way too far because I'm not writing them anymore. I just keep saying, whenever we finish
some work, update the documentation, create new documentation, and that's
what they did in the past six months. And here is where it becomes crucial
that in this folder, I'm also having a session logging, okay? So whenever I had a session with
the team, they write down the conclusions out of this session. And as you can see, just for July,
these are all the conclusions you know, they're all the insights written
down, And then also when we go into the team where the agents actually
live, if we go for Larry, he's the main character here, orchestrator. They all have their own journals
where they can have journal entries with even deeper insights for their
specific work that they are doing. And this is sitting there, and they
are using this in order to stay in line and, uh, don't leave the
guardrails and things like this. However, we can now leverage this
in order to show the issues that are occurring, and that brings me back to
the initial reason why I'm making the video, that I feel it's going off rail,
thumbnail creation, video creation. I see it's sometimes using,
outdated information. So this leads me to the conclusion
that it's using outdated information. And what I'm showing here is the same,
as if you're working in a bigger company where you have a lot of work instructions
and SOPs and guidelines too, to keep the team aligned on what is the single source
of truth that they should look at, and that's the problem that we have here. I have just a gut feeling, and I cannot
visualize it, even that we have these nice things, but this is not telling me
anything about the issues that I have. And that's why I told the team now to
create a report to make a comprehensive audit about the complaints that I made
in the past six months, the insights they had, and also look at contradictions
inside this documentation that they create for themselves to stay in line. And that's what they came up with,
and I want to share with you the actual outcome of this report. And that's really interesting,
and I thought you might be interested, too, to see that, okay? So it comes up with this output,
and it tells me out of the box the folder is not too big. its rules cannot bite So it looked
through six months of session logs and specialist journals were read for one
purpose, find every frustration Tom voiced and find why the fixes did not hold. And I will provide the prompt in order
to create this report and this audit inside myICOR if you want to just,
share this with your own AI team to see what they will come up with too. But this being said, you see here It
looked through one point forty-five million words and one thousand
five hundred ninety-four logs plus seven hundred forty-seven journal
entries that the, my agents did. And this is really powerful. I mean, AI is here to
make sense of information. So now that the AI is actually creating
their session logs and their insights, I can now leverage this functionality
to actually come up with insights from their own knowledge that they created. So they also found that there were
twenty-four rules in Chula- in July alone that I had to restate, uh,
mention to them so they stay in line. And, six of ten were actually
written down but then broken again. And then live contradiction twenty-nine,
two clusters where it looked between the different team knowledge
documentation to find these issues. And hundred and seventy-three open
tasks that the team has in this folder and we didn't follow up with. That's something I let loose, to be
honest, and I never looked into the tasks. this folder that I'm using here They also have their own task management
system here where they have open, in progress, done, and canceled. So this means whenever I start
a session, they can look into this and follow things up. But look at this. This is not-- That's a no-go. We cannot have so many tasks, and that's
on me because I, didn't set up a system for them to keep track of the task, and
that is the whole purpose of this report, to fix exactly these things and bring
everything into order to make it more transparent and traceable in the future
so these things cannot happen again. that's all based on experience
working with human teams in the past. These are exactly the same issues
that came up in corporate when I was working bigger teams, project
work, and all these things. It is the same issue that comes up in
any business  between humans working with each other when it comes to keeping
information up to date, keeping track of the tasks, focus on the right tasks,
that they actually had a yearly goal for, and many things that I just leverage
now from my experience coaching people and businesses in this regards too, that
I now apply to my own AI system and AI team, and this works perfectly and, I
love this report that they came up with. And here again, Tom is the
monitoring system, the QA gate, and the contradiction detector. So even that I have a QA agent who checks
the things before they get back to me, I still have to do a lot of, back and forth
to get it right, and that's something I know I just was too busy to look into this
as I was still faster and getting more better outcomes than ever before using
this system even if it is not polished. So just to be clear here, I got more done
than ever before, but now is the moment where I can do the refine part in ICOR. our methodology. ICOR stands for input, control, output,
refine, and it defines a productivity system end to end for humans, right? How, how we use it, what
tools we use, and so on. And now here,  I want refine my
system by looking into how I can optimize my capturing habit, and
the ways how I capture information and bring it into the system. how can I actually optimize the control
part where it organizes the knowledge? Although it's connecting information
in a way that I never was able to do it in the past manually, linking
the things together using tools like Obsidian, Heptabase, Tana. This is something AI does
for me now inside the folder, and the outcomes are insane. And as you can see, this cross-referencing
even happens in these session logs, in the work streams, uh,
documentation, and all these things too. And then you see here a hundred fifty-nine
of five hundred seventy-five tune sessions that require Tom correction. So here, by the way, you see it
takes it as a negative, right? But I would say it's pretty okay, the
ratio, and, and it's insane how many sessions actually I ran in just one
month, five hundred seventy-five sessions. So you see I'm doing a lot of things
in parallel, and that's one of the issues that it also comes up with,
that even that I speed up things, we run into issues like, parallel
sessions destroying each other's work. That's something that's really an
issue, especially if it is working on the same code base and things
like this, where they run into each other and, uh, break their own code. Also, again, it's amazing because, AI
is really aware and it is really good in fixing things if something breaks, as
long you have a way to backtrack where it was before and find how it worked before. GitHub is one of the things, but the
session logs are crucial too, because there it can also go back and find
exactly what they worked on in the past. And that's why, to me, that's the
most crucial thing that is not even getting close to any of the memory
things that I would get in here. Plus, the fact that my memory
that I'm building in my local folder can be accessed by any AI. So I could now use Codex or Gemini to
point it at this too, and then they will start working with the memory
that I have inside the folder, and this makes me, independent of any AI models. Maybe in the future when we get the nice
Apple M7 Ultra chip, it's worth to have a local model that is as capable as Opus 5. I would be very happy even that the
models become more and more, I'm really happy with Opus 5 right now. It does more than a good job with   with
anything that I'm throwing at So having a mo- local model that's at this level would
be perfect, and then I have a completely com- enclosed system for myself. That would be a dream
really becoming true. We are not there yet, and yet we are
still, uh, being able to handle this. This being said, let's talk about
the parallel work, because I'm using Visual Studio Code instead of opening
several terminals in different places, you know, all over the place. That is really becoming really messy then. So you have all these terminals
open in different sessions. I'm not a coder, and yet I'm using
VS Code because it helps me to better organize  my work because here on
the side I see this folder content. As I said, here's the PKM and all
the things that are in there, but also here are the different sessions. So I can actually start different sessions and work on
them, but this is what you can see. This is the mess that's happening. All these open sessions I need to
work on and this makes no sense. And if you go to your, Claude Desktop
and you might be using, working in here, you might have the same issue here on the
side where you have the open sessions. You try to pin them to keep track of it. whene-whenever you open it, you need
to read through the chat history and so on to understand what's going on. And this takes obviously a lot
of time and friction to get back into what you've been working in. That makes no sense at all, and
that's why I'm working in parallel on a system that visualizes to me much
better what we've been working on. But obviously the best way to keep
track of these things is use a proper productivity system like we use, uh,
ClickUp for project management, and now I can actually asynchronously
have the work attached to me So for example, when I'm working on
myICOR or membership platform, there are things that I keep track of and now my,
my AI has inside the folder a file that holds all the access data that I need to
get access to ClickUp from here, right? Like the connectors that you might know
in Claude Desktop, where you connect the tools directly with each other. I'm using it, in a self-built way,
which AI perfectly can do for you. Again, makes it much more
versatile to use and access it in a way that you prefer to use it. And then I can actually say, "Okay,
here's this thing. We need to update the URL." I just use the URL to this task,
and I share it with AI, and they access ClickUp for me, get the information,
and start working on the task that is assigned to me through this task, and
that's the best way to organize myself. I'm also still using Todoist for my
personal tasks and then a planner application to plan out my time and so on. That's really crucial so you don't lose
track of the things that matter and that you need f- to focus on instead of going
off-rail yourself and chasing every rabbit that appears during a chat conversation. I think everybody using AI knows what I'm
talking about here when I say, you you know, during a session you want to solve
one thing or want to build one thing, and AI starts suggesting you five new
things that you think, "Man, this would be amazing if we do this too. Let's do it."
And you s- end up with a lot of things. If in worst case, in the same session,
that's something I would never do. I always try to focus inside one session
on one specific thing, and that's why I have so many sessions open because at
least I can say, "Okay, each session, they just focus on one specific thing
and don't go left and right." But that's also something that, they did. They picked up work from other sessions
urgent tasks and brought them up in another session that is not in
context, and that's very confusing, and it drives me that I just constantly
need to make decisions on things that just don't matter right now on
the work that I need to get done. And it was also a frustrating thing
that I had, and that's no problem. I can tell the AI team, " Okay, in
the future, the sessions, they need to focus on just the request they
that I handed over in this session and don't come up with other things."
It will create a new guideline. It will update the Claude.md file where
the instructions are living for AI. But I wanted to make it
properly this time, and that's why I created this report. It's not only for me, this report. It's also for as a snapshot at what we are
at, so we can actually use it to plan out how we optimize the system moving forward. And you see already a lot
of things that appeared here And then we start here with the
complaint, and here we come then to the complaints that recurred are requirements. The ones voiced once are not,
and I love this approach, right? If I kept repeating things, this
should be, focused on much more than the things that I have in one. And the thing is, I'm looking already
forward because once I have this fixed, I can now set up A recurring system
where it writes, creates these raw reports on a weekly basis and checks
if the system is actually working, what are the insights from the session logs,
all these things I could have done already, but I've made so many other
things, so I didn't need it right now. But now is the moment I will build
this properly from the ground up. And that's the key what
we teach in myICOR. It's not about handing you over
a software that you use and try to force yourself into. That's the past. That's strongly what we believe. You can build your own software now to
the needs that you need it, and this is becoming easier and easier over time. We provide to you this folder. There are agents in there who
are capable of building software for you, so like Felix and so on. They are here to build these things. You see, this is highly refined, report
in a branding that we call Incline. That's also myICOR branding, and it
perfectly aligns with this, okay? But the thing is, you should
get the skills to build this yourself in the way that you need
it for your specific business. And that's why there's no way around to
understand the underlying foundations of a productivity system end to end. The more you understand why you keep
forgetting things, why you are not able to stick to the goals that you
have set or complete projects that you set up and things like this,
AI will just amplify the noise. It will just get w- worse. You need to have this overview, the
holistic understanding of what is going on in your life and your business, and from
this standpoint, you will then build up a system like this, and it will help you
to maintain the sanity that you achieve with this myPKI setup that we have here. Instead of thinking that, "Okay, I have
now AI, and will solve all the problems." We see this over and over in our weekly
coaching sessions that we have with our inner circle members, that those
who really get the point that AI allows them now to go wild but also leverage
it in a way that it helps them most, those go really far, and they sh- it's
amazing if you go, just go inside myICOR If you go inside the membership It's amazing to see what actually
members are sharing there because members also can create articles in here. And we have, for example,
Mike, he's very consistent with publishing new insights that he had using my PKM, building his own sy-
system, and this is where, uh, we really think the community is really powerful
here, too, uh, that we are all in the same boat, and we are sharing all our
insights in here, like here also insights from the EU AI Act and things like that. It's really interesting for ourselves
as the founders to even go through these things and learn a lot from it. So what-- where is this leading now? this is a long report. There's also a lot more that I asked
for that is not relevant for this video right now because I'm looking for a
way to optimize the ecosystem in my PK and have an operating system where I
have the different things organized. Uh, I will talk about more on this
in this channel too, but for now, I wanted to share with you that if you
feel that your AI is going off rails, you're not alone, but it's important
to understand why it's happening. And the best way is always to ask your
team what's going on, review the work that you have created inside the folder,
let them do the work for you to explain to you how it's interconnected, if there
are any defects or anything like this that will help you then to make the
right decision on how to move forward. And again, the best is always to have a
tool-agnostic methodology behind this, where you can leverage the concepts and
workflows on any tool that you use, on any life and work situation that you
might be in, that you then translate into what you want to have the tool to look
like, how it should function, how the team, the human team, should work with
each other, and many things like this. And that's where we have the ICOR
methodology,  which we teach inside myICOR with comprehensive courses
covering note-taking, personal knowledge management, task management,
project management, and automation. And inside these sessions, you will get a,
a video, you get the magic slide, you get comprehensive sections to read through. And then also very important, in our
opinion, is the growth assignments, where it asks you questions that shows you
the quality of your productivity system once you went through all the questions. So you really end up with a productivity
system end-to-end that just works for you in the way it should work And we
are not reinventing the wheel when it comes to, wording or the,  definitions
inside a productivity system. This is all based on
real-world, situations. And you can even connect your AI using
the myICOR and then ask questions about your journey, and it will point you even
to the right articles that, uh, we have in here, or the lessons, or even the
coaching sessions down to the timestamp So you can see actually Paco and
me answering a specific questions that you might have at a specific
time in the coaching session, uh, right in there, sharing our
screens and explaining it to others. So if you are stuck and you
need support with your AI system, with your productivity
system, join us inside myICOR. You can get started for free. You can download the scaffold for free. And these pro- this problem that I
covered today in the video is exactly what we are covering in our coaching
sessions too, and helping others to grow. and in there we are growing
together, building this out. But what we always reinforce
is the understanding of the underlying concepts and workflows
about productivity in general. Because we see over and over the moment
it clicks for people how to capture information, how to organize information,
how to keep track of your tasks. This is the moment where it also clicks
how they can take most advantage of AI. So if you haven't subscribed yet
to the channel and you want to learn more about this, make sure
you subscribe to the channel. And I catch you up in the next video
