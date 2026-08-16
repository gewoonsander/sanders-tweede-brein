# I switched off Claude's memory. My folder does it better.

- **Video:** https://www.youtube.com/watch?v=p79T9P2WmTI
- **Ondertitel-taal:** nl (Lokale Whisper-transcriptie (large-v3), geen ondertitels beschikbaar)
- **Bron:** Lokale Whisper-transcriptie (large-v3)

---

I'm making this video because I'm sure I'm not alone with this when it comes to persistent memory and having a consistent outcome using AI.
If your AI seems to keep forgetting, you keep reminding it all the time about the things that you have said it already a hundred times,
this video is for you and we will dive into my own setup to show you that I'm struggling with the same things that you might do
and what solution I have to the problem to overcome these things.
Let's start at the beginning because I don't know where you are at.
So my main AI that I'm using is Cloud and if you're using the Cloud desktop or in a browser, this is what it looks like
and on the side there might be a long list of different chat sessions that you had that I also had in ChatGPT back in the times
where I tried to find the chats that I was working in in order to find things that I looked up.
This was already something that we overcame by not relying on the sessions themselves at the source
and the things that we store information but extract whatever was the outcome and then move it into the final destination,
the note-taking app that we used, the project management tool and so on.
Now this changed in the beginning of the year when we started using a local folder approach
and here is my local folder and what this is, there is a folder called PKM, Personal Knowledge Management,
and here is all the things that I store related to my life and to my professional work
but there is also instructions for AI.
How to?
How to work with me when they work with me and this means there is a team knowledge folder
and in here there are guidelines, there are SOPs, standard operating procedures and there are also work streams
so we have recurring work that we do together that we can look at.
How does this work in practice?
Well, I can always right-click in here and just start a new terminal at the folder and launch Cloud this way
and now I can just start talking to my folder or inside Cloud desktop.
I can use Cloud.
Co-work and open the folder this way and start working with it or use Cloud Code in here
which is a visually more pleasing experience that you might have with the terminal
and I can start talking to my folder here.
Anyway, no matter how I access this folder, it will always pick up these guidelines and how it should act in here
and that's the magic behind the MyPKA system that we are using that out of the box,
you can download this for free, you have the basic instructions for your team, how to act in there,
and there is an orchestrator agent, the single point of contact that when you say who are you in here,
he looks into the folder and he says I'm Larry, your team orchestrator, my PKA
and then he starts telling me that he has specialists he can work with
and that's the magic behind this because now I have different agents that do specialized work for me
that I handed over to the team that I iterated on, that I worked with them already
like content creation, website building, support ticket handling, many things.
That doesn't get lost in the void because many people still using chat or even co-work
and they start a session, they work in this and then the next day they start a new session
and they wonder why it keeps forgetting even that Claude claims that they have now this memory here
where you see it search and references previous chats and it generates memory from chats
and you see I have them switched off because I find them not reliable enough
because this is looking up and extracting information in the way that Claude thinks it makes sense
but not the way that I want to provide information to my AI.
So the way it works inside the folder is that everything that gets created in here are markdown files
and you might have heard of this approach already, the wiki approach from Kapathy
where he uses wikilinks in there and that's essentially the basic of it
where any journal entry, anything that gets created is a markdown file
and that's basically the basic of it where any journal entry, anything that gets created is a markdown file
because this is looking up and extracting information in the way that Claude thinks it makes sense
And it's interlinked with each other.
And I could open this now for example in Obsidian or other tools to show that.
Or build my own application.
And I in fact did this for team knowledge.
I just told the team build an interface that shows me team knowledge.
And here we go.
This is the interface now that just hooks into my folder.
And it shows me the team knowledge this way.
So I can click actually on the guideline.
And it shows me what agent is responsible for it.
And let's see if I search for video.
There we go.
Video publishing guideline.
And here it is open.
You see all the responsible agents.
And here is the work stream.
What they work according to.
And the crosslink SOPs.
And I can open them up.
And that's no special app.
You can build these things just asking AI to represent your folder content in the best way possible.
Obviously my AI team has over a year of experience building things like this with me.
And that's the key about persistent memory.
Where they write things down.
In these documentations that they can refer to in the future.
Whenever you want to build something or do some work that you do on a recurring basis.
And those of you using Obsidian might be familiar with this view.
Where you actually can see the interconnections.
So here for example, Charta, one of my agents.
She's involved in these work streams.
And when I click on the work stream, I see how they are connected to other work streams.
And SOPs and so on.
But all this, as you can see.
It becomes really overwhelming when we look at this standard operating procedures.
I have 111.
I have 43 work streams and I have 72 guidelines.
And this seems to me way too far because I'm not writing them anymore.
I just keep saying whenever we finish some work, update the documentation, create new documentation.
And that's what they did in the past six months.
And here is where it becomes crucial that in this folder I'm also having a session logging.
Okay.
Whenever I had a session with the team, they write down the conclusions out of the session.
And as you can see, just for July, these are all the conclusions.
You know, they're all the insights written down.
And then also when we go into the team where the agents actually live.
If we go for Larry, he's the main character here, the orchestrator.
They all have their own journals where they can have journal entries with even deeper insights for their specific work that they are doing.
And this is sitting there.
And they are using this.
They are using this in order to stay in line and don't leave the guardrails and things like this.
However, we can now leverage this in order to show the issues that are occurring.
And that brings me back to the initial reason why I'm making the video that I feel it's going off rail.
Thumbnail creation, video creation.
I see it's sometimes using outdated information.
So this leads me to the conclusion that it's using outdated information.
And what I'm showing here is the same as if you're
making a company where you have a lot of work instructions and SOPs and guidelines to keep the team aligned on what is the single source of truth that they should look at.
And that's the problem that we have here.
I have just a gut feeling and I cannot visualize it, even that we have these nice things.
But this is not telling me anything about the issues that I have.
And that's where I told the team now to create a report to make a comprehensive
audit about the complaints that I made in the past six months.
The insights.
I had and also look at contradictions inside this documentation that they create for themselves to stay in line.
And that's what they came up with.
And I want to share with you the actual outcome of this report.
And that's really interesting.
And I thought you might be interested, too, to see that.
OK, so it comes up with this output and it tells me out of the box.
The folder is not too big.
Its rules cannot buy.
So it looked through six months of session logs and specialist journals read for one purpose.
And I have to find every frustration tom voice and find why the fixes did not hold.
And I will provide the prompt in order to create this report and this audit inside my
iCore if you want to just share this with your own team to see what they will come up with, too.
But this being said, you see here it looked through one point forty five million words and one
thousand five hundred ninety four logs plus seven hundred forty seven journal entries that my agents did.
And this is really powerful.
I mean, AI is here to make sense of information.
So now that the AI is actually creating their session logs and their insight,
I can now leverage this functionality to actually come up with insights from their own knowledge that they created.
So they also found that there were twenty four rules in July alone that I had to restate and mentioned to them.
So they stay in line and six of ten were actually written down, but then broken again.
And then life contradiction.
Twenty nine to clusters where it looked between the different team
knowledge documentation to find these issues and hundred seventy three open tasks
that the team has in this folder and we didn't follow up with.
That's something I let loose, to be honest, and I never looked into the task.
This folder that I'm using here, they also have their own task management
system here where they have open in progress, done and canceled.
So this means.
Whenever I start a session, they can look into this and follow things up.
But look at this. This is not that's a no go.
We cannot have so many tasks.
And that's on me because I didn't set up a system for them to keep track of the task.
And that is the whole purpose of this report to fix exactly these things and bring
everything into order to make it more transparent and traceable in the future.
So these things cannot happen again.
That's all based on experience working with human teams in the past.
These are exactly the same issues
that came up in corporate when I was working bigger team project work and all
these things, it is the same issue that comes up in any business between humans
working with each other when it comes to keeping information up to date,
keeping track of the task focus on the right tasks that they actually had a yearly
goal for and many things that I just leverage now from my experience coaching
people and businesses in this regards to that I now apply to my own AI system.
And I team and this works perfectly.
And I love this report that they came up with.
And here again, Tom is the monitoring system, the QA gate and the contradiction detector.
So even that I have a QA agent who checks the things before they get back to me,
I still have to do a lot of back and forth to get it right.
And that's something I know I just was too busy to look into this as I was still
faster and getting more better outcomes than ever before.
Using.
The system, even if it is not polished.
So just to be clear here, I got more done than ever before.
But now is the moment where I can do the refined part in I core our methodology.
I core stands for input control,
output, refine, and it defines a productivity system end to end for humans.
Right. How we use it, what tools we use and so on.
And now here I want to refine my system
by looking into how I can optimize my capturing habit and the ways how I
capture information and bring it into the system.
How can I actually optimize the control part where it organizes the knowledge?
Also, it's connecting information in a way that I never was able to do it in the
past, manually linking the things together using tools like Obsidian, Heptabase, Tana.
This is something AI does for me now inside the folder and the outcomes are insane.
And as you can see, this cross referencing even happens in these session logs.
And the work streams and documentation and all these things, too.
And then you see here 159 of 575 June sessions that require Tom correction.
So here, by the way, you see it takes it as a negative, right?
But I would say it's pretty OK, the ratio.
And it's insane how many sessions actually I ran in just one month, 575 sessions.
So you see I'm doing a lot of things in parallel.
And that's one of the issues that it also comes up with that even that I
speed up things, we run into issues like parallel sessions destroying each other's
work, that's something that's really an issue, especially if it is working on the
same code base and things like this, where they run into each other and break down
code also again, it's amazing because AI is really aware and it is really good
in fixing things if something breaks as long you have a way to backtrack where it
was before and find how it worked before GitHub is one of the things.
But the session logs are crucial, too,
because that can also go back and find exactly what they worked on in the past.
And that's why to me, that's the most crucial thing that is not even getting
close to any of the memory things that I would get in here.
Plus the fact that my memory that I'm
building in my local folder can be accessed by any AI.
So I could now use Codex or Gemini to point it at this, too.
And then they will start working with the memory that I have inside the folder.
And this makes me independent of any
AI models, maybe in the future when we get the nice Apple M7 Ultra chip.
It's worth to have a local model that is as capable as Opus 5.
I would be very happy even that the models become more and more.
I'm really happy with Opus 5 right now.
It does more than a good job with anything that I'm throwing at it.
So having a local model that's at this level would be perfect.
And then I have a completely enclosed system for myself.
That would be a dream really becoming true.
We are not there yet.
And yet we are still being able to handle this.
This being said, let's talk about the parallel work because I'm using Visual Studio
Code instead of opening several terminals in different places, you know, all over the
place, that is really becoming really messy then.
So you have all these terminals open in different sessions.
I'm not a coder and yet I'm using VS Code because it helps me to better organize
my work because here on the side I see this folder content, as I said.
Here is the PKM and all the things that are in there.
But also here are the different sessions.
So I can actually start different sessions and work on them.
But this is what you can see.
This is the mess that's happening.
All these open sessions I need to work on.
And this makes no sense.
And if you go to your cloud desktop and you might be using working in here,
you might have the same issue here on the side where you have the open sessions.
You try to pin them to keep track of it.
Whenever you open it, you need to read through the chat history and so on to understand what's
going on. And this takes obviously a lot of time
and friction to get back into what you've been working and that makes no sense at all.
And that's why I'm working in parallel on
a system that visualizes to me much better what we've been working on.
But obviously the best way to keep track
of these things is use a proper productivity system.
Like we use ClickUp for project management.
And now I can actually asynchronously have the work attached to me.
So, for example, when I'm working on my icon or membership
platform, there are things that I keep track of.
And now my my AI has inside the folder a file that holds all the access data
that I need to get access to ClickUp from here, right?
Like the connectors that you might know in cloud desktop where you connect
the tools directly with each other, I'm using it in a self-built way,
which AI perfectly can do for you again, makes it much more versatile to use
and access it in a way that you prefer to use it.
And then I can actually say, OK, here's this thing.
We need to update the URL.
I just use the URL to this task and I share it with AI and they access ClickUp
for me, get the information and start working on the task that is assigned
to me through this task and that's the best way to organize myself.
I'm also still using Todoist for my personal task and in a planner
application to plan out my time and so on.
That's really crucial so you don't lose track of the things that matter and that
you need to focus on.
Instead of going off rail yourself and chasing every rabbit that appears
during a chat conversation, I think everybody using AI knows what I'm talking
about here when I say, you know, during a session you want to solve one thing or
want to build one thing and AI starts suggesting you five new things that you
think, man, this would be amazing if we do this too.
Let's do it.
And you end up with a lot of things.
If in worst case in the same session, that's something I would never do.
I always try to focus inside one session on one specific thing and that's why I have
so many sessions open because at least I can say, OK, each session they just focus
on one specific thing and don't go left and right.
But it's also something that they did.
They picked up work from other sessions or urgent tasks and brought them up in
another session that is not in context and that's very confusing.
And it drives me that I just constantly need to make decisions on things that just don't matter right
now and the work that I need to get done.
And it was also a frustrating thing that I had.
And that's no problem.
I can tell the AI team, OK, in the future, the sessions, they need to focus on just
the request that I handed over in this session and don't come up with other things.
It will create a new guideline.
It will update the cloud.md file where the instructions are living for AI.
But I wanted to make it properly this time.
And that's why I created this report.
It's not only for me, this report, it's also for
a snapshot at what we are at so we can actually use it to plan out how we
optimize the system moving forward and you see already a lot of things that appeared
here and then we start here with the complaint and here we come down to the
complaints that recurred our requirements, the ones voiced once are not.
And I love this approach, right?
If I kept repeating things,
this should be focused on much more than the things that I have in one.
And the thing is, I'm looking already forward because
once I have this fixed, I can now set up a recurring system where it
creates these reports on a weekly basis and checks if the system is actually
working, what are the insights from the session logs, all these things I could
have done already, but I've made so many other things so I didn't need it right
now, but now is the moment I will build this properly from the ground up.
And that's the key what we teach in my I-Core.
It's not about handing you over a software that you use and try to force yourself into.
In the past, that's strongly what we believe.
You can build your own software now to the needs that you needed.
And this is becoming easier and easier over time.
We provide to you this folder.
There are agents in there who are capable of building software for you.
So like Felix and so on.
They are here to build these things.
You see, this is highly refined report in the branding that we call Incline.
That's also my I-Core branding and it perfectly aligns with this.
Okay.
But the thing is, you should get the skills to build this yourself in the way
that you need it for your specific business.
And that's why there is no way around to
understand the underlying foundations of our productivity system end to end.
The more you understand why you keep forgetting things, why you are not able
to stick to the goals that you have set or complete projects that you set up and
things like this, AI will just amplify the noise.
It will just get worse.
You need to have this overview,
the holistic understanding of what is going on in your life and your business.
And from this standpoint, you will then build up a system like this
and it will help you to maintain the sanity that you achieve with this MyPK
setup that we have here instead of thinking that, okay, I have no AI and we
solve all the problems we see this over and over in our weekly coaching sessions
that we have with our inner circle members, that those who really get the
point that AI allows them now to go wild, but also leverage it in a way that it
helps them most, those go really far.
And it's amazing if you just go inside MyEyeCore, if you go inside the membership,
it's amazing to see what actually members are sharing there because members also can
create articles in here and we have, for example, Mike, he's very consistent with
publishing new insights that he had using MyPK and building his own system.
And this is where we really think the community is really powerful here, too,
that we are all in the same boat and we are sharing all our insights in here,
like here also insights from the UAI Act and things like that.
It's really interesting for ourselves as
the founders to even go through these things and learn a lot from it.
So where is this leading now?
This is a long report.
There's also a lot more that I asked for that is not relevant for this video right
now because I'm looking for a way to optimize the
ecosystem in MyPK and have an operating system where I have the different things
organized. I will talk about more on this in this channel, too.
But for now, I wanted to share with you that if you feel that UAI is going off
rails, you are not alone, but it's important to understand why it's happening.
And the best way is always to ask your team what's going on.
Review the work that you have created inside the folder.
Let them do the work for you to explain to you how it's
connected, if there are any defects or anything like this that will help you
then to make the right decision on how to move forward.
And again, the best is always to have a tool agnostic methodology behind this
where you can leverage the concepts and workflows on any tool that you use on any
life and work situation that you might be in, that you then translate into what you
want to have the tool to look like, how it should function, how the team,
the human team should work with each other.
And many things.
Things like this.
And that's where we have the ICOR methodology, which we teach inside my
ICOR with comprehensive courses covering note taking, personal knowledge management,
task management, project management and automation.
And inside these sessions, you will get a video, you get the magic slide,
you get comprehensive sections to read through.
And then also very important, in our opinion, is the growth assignments that
asks you questions that shows you the quality of your
productivity system once you went through all the questions.
So you really end up with a productivity system end to end that just works for you
in the way it should work. And we are not reinventing the wheel when it comes to
wording or the definitions inside a productivity system.
This is all based on real world situations.
And you can even connect your AI using the myICOR MCP and then ask questions about
your journey and it will point you even to the right articles
that we have in here or the lessons or even the coaching sessions down to the timestamp.
So you can see actually Paco and me
answering specific questions that you might have at a specific time in the coaching
session right in there, sharing our screen and explaining it to others.
So if you are stuck and you need support
with your AI system, with your productivity system, join us inside myICOR.
You can get started for free.
You can download the scaffold for free.
And this problem, this problem that I covered today in the video is exactly
what we are covering in our coaching sessions too and helping others to grow.
And in there we are growing together, building this out.
But what we always reinforce is the understanding of the underlying concepts
and workflows about productivity in general, because we see over and over the
moment it clicks for people how to capture information, how to organize
information, how to keep track of your tasks.
This is the moment where
AI also clicks, how they can take most advantage of AI.
So if you haven't subscribed yet to the channel and you want to learn more about
this, make sure you subscribe to the channel and I catch you up in the next video.
