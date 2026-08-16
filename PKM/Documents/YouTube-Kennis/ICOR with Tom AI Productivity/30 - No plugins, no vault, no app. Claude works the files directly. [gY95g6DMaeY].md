# No plugins, no vault, no app. Claude works the files directly.

- **Video:** https://www.youtube.com/watch?v=gY95g6DMaeY
- **Ondertitel-taal:** en
- **Bron:** YouTube-ondertitels

---

Using AI for personal knowledge
management is so much simpler. Then I see other people are setting it up
and in this video, we'll show you proof. So you might have seen all these
videos about , use Claude with obsidian, and I get it why they're
coming up because obsidian has a following base and a lot of traction. And using this with AI now seems
to be the right thing to do. And many of these videos are based on
a post on X from Andrej Karpathy, also the inventor of the term vibe coding. Um. Who came up with this LLM knowledge
basis, and if you watched my previous videos long before this
post, I already showed you that. We killed all the PKM tools out there
that we've been using for years. This includes obsidian,
but also Heptabase tan. All these knowledge tools have been
replaced for my co-founder, PA Cont, multi-business owner and myself. Just using Claude Code in a local folder. And yet even in this post, which is
by the way, a great post summarizing exactly the things that I described. I wonder why there is still
obsidian in the equation. And we will break this down step
by step in this video, and I will show you exactly how I'm doing it
without Obsidian this being said. There's no wrong or right. If you feel that obsidian gives
you the interface you want for your notes, that might be the reason. But you don't need to feel that. You need to use Obsidian  in
order to make Claude work for you. And that's the misconception
I see appearing over and over. Alright, this post by Andrej got actually
in the meantime, 17 million views and all he shared. Here is a few things that you
need to understand in order to use AI for your knowledge work. But if you watch my previous video
it's as simple as that, I even think there are are things missing here. something I'm finding very
useful recently using alums to build personal knowledge basis. And we are saying personal
knowledge management. Done. The era is over. The future is PKA Personal Knowledge Assistance and we will get to this point here too,
because we consider personal knowledge management was always manual work. You had to make, create
backlinks for yourself. You have to think about how things
are connected, all these things. if you let AI do this work it frees up
so much mental power, so you can focus on the things that really matter and just
retrieve the insights from your knowledge that really matter right now to you. that's what Andrej is describing here too. So he builds a wiki, he ingests
data, like random articles that he finds, papers, reposts, data sets,
anything that interests him, and he puts it into a raw directory. , if you look into my setup in VS
code, and now you can call me out. Wow. But you're also using a tool. Come on vs. Code is really the basics of
the basics that you can use. So I have my Claude code combined
with my folder structure on the side. So if you are using already obsidian,
here is the folder structure on the side, and I have a team inbox here. Okay. That's what. Andrej is calling raw, in fact, but
I have a whole system, so if I move anything in here, so for example
here, if I scan anything with my paper, scanner, any documents, they
automatically end up in this folder and my AI team will process this inbox
and move it into my different areas. In my knowledge system, PKMC,
there are the different things. So I don't need to have obsidian for this. To have this folder structure visually
but on the other hand, I also have Tom's inbox, which is the output of the ai. So whenever I work on something,
I get it here for review. Alright. He talks about raw directory,
which in fact to me is an inbox. That's the things where he's most,
where he moves everything into it for LLM to processing later. So it compiles a wiki out
of what it is in there. And then you have just
a wiki and the thing is. If you read through the whole thing, he's
just referring to a specific knowledge base So the wiki includes summaries of
all the data, raw backlinks, and then categorizes to convert web articles into
MD files, uses obsidian web clip extension to get everything out of the web,
including the images and all the things. Yeah, this is not. Tides to obsidian, that's totally
possible using Just Claude get it into a local folder instead of using obsidian. And we come to the interface now
where he mentions the IDE here. He uses obsidian as the IDE, which is the
front, and it's the interface representing the data that you moved into this local
folder where he can now view the raw data. The compiled wiki with the backlinks
that you can click through this, and this is where people get hyped
now that they are able to ask AI to create this inside obsidian and then
being able to click your way through. that's not something special. We look into this later in this
video, the controversial thing here in this is that he says, important
to note that the LLM writes and maintains all of the data of the Wiki. I rarely touch it directly. So what's the point of the interface then? a interface just representing the
data would be more than enough. So if just for this reason alone,
obsidian is already overkill with all the input that you can do manually
inside obsidian, I've played with a few obsidian plugins to render and view data
in other ways, map for slides and so on. Again, this is where. I would rather ask AI to
build me something like this. And I show you in a moment my own
setup instead of using something that is built by somebody else and
modifies the local data in a way. So it works with, Obsidian only. So there's a q and a that he's doing. That's where it gets interesting. He now loads in all the information
and can ask questions about it. A hundred articles, about 400,000
words, and I wonder, okay, If this is all you want, you can use. Notebook lm, which gives you a
lot more out of the knowledge. That's what I would use if I have a
specific use case loading in hundreds of articles to get something out of it. Load into something like notebook lamb. Also, I would say the setup that I have. K notebook lamb. That's the rec system that he starts
then talking about in a moment. But you see here, we have 118 sources
in there, including links to YouTube videos, articles, and many things,
uh, articles on websites and so on. And then now I can ask anything about
these articles, but beyond that, I can also generate videos like here. You ask a question, it creates a
slide deck, but also spoken text and many other things you can do with it. Audio overview, slide deck,
video overview, mind map reports, flashcards, quiz, infographics. Start the table. Also for free. if you argue now about privacy, that
might be a reason to use now obsidian. But if you compare it, just loading
in articles and asking questions about these articles, the output might be
much better in NotebookLM  than doing it inside a Wiki style obsidian. That's just I would need to prove because
that's not something I have tested yet. But okay. Let's assume it's privacy
and you keep it locally. This is a very specific use case. It's just adding interest,
things of interest, and then asking questions about it. It's a very basic thing, And then he says,
I thought I had to reach for fancy rack. But the LLM has been pretty
good about auto maintaining. Obviously if you use Opus 4.6 model and
you have a 1 million context video, this now takes a lot of articles way beyond
the 400,000 words to lose the context. But what is there? Is, there's no structure at all. So it needs to always look
at the whole thing to get the connections and understands
what you actually want from it. So therefore, each time it's very
likely that you get a different answer to the same question because it starts
from scratch that's where it makes no sense, to just simply load in loads
of articles and things like this. To build the knowledge base, in
my opinion, a knowledge base that you really leverage over time is
the, the conclusion that you make, the output that you generated. That should be the things that
build your knowledge base. So in my opinion, it's much more
efficient using notebook lamb or using something locally in a separate folder. You do this research and then you compile
all this conclusions and connections. Enrich your personal knowledge system
with these conclusions because now you're generating a very personalized
knowledge system that has no noise in there, but only signal. And what is signal? Well, it is this what matters to you
specifically because another person might need other insights from an
article than you right now need. So I would never. fill up my system with all these things
without indexing and giving it actual structure and weighing off the context
and so on to leverage this on time. And that's where I think that
this all works great, as he says here on small scale. But I'm pretty sure the moment you start
scaling this, you get diverse results. And again. The way we built the systems locally
on our local folder, I can switch at any time from my Claude to Gemini
to Jet GPT or whatever is now the, the newest thing and the best brain. And it doesn't touch anything
on my local knowledge base. And that's important to
understand in my opinion. So now we get to the output. Instead of getting answers in
text terminal, I like to have it random markdown files for me. Yeah. Great. Mark that. Yeah, same for me. Or slideshows or ,  whatnot. And all this views in obsidian, and
you can imagine many other visual output formats, blah, blah, blah. Okay. Yeah. So he's just saying that he likes
to get this visualized instead of  just having it in a chat box. And that's completely right. And I think now is the
moment where I show you. The basic setup of any knowledge base
that I build up in the basic structure. This is the folder. I call it AI Team Blueprint for now. Right? It doesn't matter. what we have here, there are
inboxes and there is a team inbox. And there's an owner's inbox. And what happens now when Andrej
says that he has a raw directory? Well, this is the team's inbox. So if I have anything I want to share
with my AI team, I move it in there. And if there's anything that my AI team
has generated and created for me, it moves into the owner's inbox for me to review. Which doesn't mean it stays there
because once I approved whatever was generated, I will then say, well digit,
or store it inside the knowledge. And here you see there's an Index MD file. So in this knowledge folder, everything
gets indexed and that's how you can make a bottom up approach. Building this, and then when you
hit a ceiling, you go for databases and then you hit a ceiling and you
go for a rack system and so on. While these are things that maybe
most of you don't even reach and you will be fine just using markdown
files, but in the end, this is just a folder structure and if I struggle
to visualize this, it, it's no point. I have an MD file, I can open it
up and read it this way, I can have markdown visualizers, and
And that's why I use VS code. It's free and it's all, you need to
visualize things in a way you need and you are much more flexible than using obsidian
because the difference to obsidian is vs. Code won't change your files. It just. Gives you access to these files,
and you can work on these files. But obsidian changes these files to get
a database view and all these things. You need to make it exactly
like obsidian needs it. So you can only use
obsidian to visualize it. And here you see now I just opened
up this AI Team Blueprint folder that I just showed you here in Finder. Okay. we have in Finder here. there's the Claude or
them, the Claude file. There's some commands in there. Uh, we have a Claude or md how it works. This is just a, a empty blueprint
that I made here, and if you want to get access to it, if you're free
to join but all you need to have. Is here vs. Code and now I'm in an empty folder. I could also open just an empty
folder and get started this way. So I could now say open
folder, and I go to my desktop. I right click, I say,
new folder, test folder. Create open. Boom. Okay. Here's a test folder. And I showed you this
already in previous videos. If you want to see how I use VS code
with Claude, you can watch this later on. I just want to make my point
here that this is how you access your folder as easily. And now I see these videos
where people use vs. Code and clawed together with
obsidian, and that's the point where I really don't understand why
would you do this either or, right? Because here I can now open
Claude work inside this folder. So whatever I do here,
create A PKM folder. Just an example, okay? So it knows it is right. Working inside this
folder, you will see that. Here it is. Okay. It created this PKM folder, if
we open this in the finder again. Is this PKM folder? See, we are in the, we are in the test
folder on desktop and it created this PKM folder, and that's how you can
work with Claude and build whatever you like with full transparency and
no, additional metadata that is added to your markdown down files and so on. So let's close this. And show you my real setup. Okay? This is my per, that's my personal
knowledge assistant system here, private. you see this goes way beyond just
asking AI about my Wiki knowledge because I want to get things done. I want to have, I have workflows
that I need to get done regularly, and therefore I have a team. Of several agents that are all
specialized in different things they do. I have SOPs. Okay. Standard operating
procedures for the team. And you see this is not, has
nothing to do with Claude, but it was generated by Claude. The way I say do it. So for example, YouTube extraction,
okay, here it understands. Well it's in German, I can show you in a moment our AI
team working inside our business. Is it, which is set up exactly the
same way, and you will understand this goes right way beyond just having
a local wiki and asking questions. So I'm not saying that this
is a bad thing to do, okay? I'm just saying it's overly
hyped for what it is. And it is just scratching the
surface while overcomplicating things by using obsidian. And now you could argue, yeah, but how do
you visualize your, your information now? Yes, of course you can use obsidian
to do this and, get stuck to it. Or you simply build a visualization
of this for yourself using ai. And in fact, when we keep reading. He mentions that he does health
checks of the Wiki to see if it is the correct, and then he says extra tools. I find myself developing additional
tools to process the data. I vibe coded a small and a search
engine over the Wiki, which I both use directly in a web ui, but more
often I want to hand it off to an LLM via CLA as a tool for larger queries. Here again, I wonder Why
do you need obsidian? Is it the knowledge graph? You can vibe, code it? Is it, I don't know because I don't
like the visuals of, obsidian at all. And if I compare this to what
I vibe coded in my thing here. Where you can be very simple, just having
an HDM Alpha showing things in your browser, or you can even have an actual
app created, which is very lightweight. Oh shit. in comparison. Here's my interface that I build based
on my Wiki, and this is not just a wiki, there's a daily journaling application. There are all my PDF files,
like invoices, contracts, all the things that I scanned in. I can access via. Here, here are the different
agents, um, that I have running. Here's a database explorer. There we go. See, this is a proper database where
I can visualize all my data this way. Do I need a knowledge graph? I don't need it, but I could
create it in minutes if I want one. Right? Uh. Then here, journal. Look at this  beautiful journal
where I have everything greatly with Seneca, you know, giving me feedback
on stewards about what I added there. here, is back linking. I can click on Pako, it opens up Paco
Canero Here all the entries about Paco Cross-linked in a beautiful way
that I think is beautiful and you can do it the way you think it would be
beautiful for you, including metadata and all the things that you can have. And, uh. This is something obsidian
will never provide to me. I cannot have a mood track or
things like that without making a very complicated plug and setup and
things like this that either need to relay, rely on external developers. Here I can really build
everything myself and this. my friends, is a real personal knowledge
base that I can leverage over time versus having a wiki where I just dive in and
extract some information out of it. And then going it here
is my life is in there. Uh, everything related to my life. Finances, family, legal. And do I share anything
with except with Claude? No, it's a local folder and it's
backed up on Dropbox and all of. Benefits that you also know from
what Andrej is sharing here. So here is already vibe coding. I just think the layer of
obsidian is complete nonsense. And I see people riding the wave
now because people on the cover, it seems like it makes all the sense. But in the end, if you want to really
build a proper AI system where you start growing knowledge over time, persistent
memory and all this, you need to have a proper AI system set up and not just
building a wiki to ask anything that you were able to do with not bog lamb
or by the way, using something like. projects inside your desktop version
of Claude or in Cowork project. Okay? It's nothing different. You can upload in projects. I can create a new project, start from
scratch, and I could now load in all the articles and so on that I'm interested in. This is a lot more friction. I agree. That's why, it's great to have this. If you say, That you're using obsidian
for the extension to extract the data from the website and so on. Maybe that's worth it. I never needed it. I have perplexity connected. I extract everything this way. And the point is, as I said in the
beginning of the video, is it really worth having everything inside my
system or just a signal that I need to make my own conclusions and build
my own knowledge base in a proper way? And he says, even as the repo grows,
and that's where people get confused. Whoa, why? He said, why do you say repo? We have a vault in obsidian right now,
man, in the end it's, it's a repo. He says, a correctly right. And that's where you have VS code again,
Where you have much better control over your repo And that's, uh, something
I show you in another video where you can now connect this knowledge base to
GitHub and make it a synchronized repo. And you have access from anywhere,
even from mobile using your Claude. Mobile application. So here is, for example, the team This is
what I'm using in our business every day. And if you go to the owner's inbox, you
see there's a lot of things going on. And if I go to the archive, you see
how long I'm using this already. So I started in February to build this up
and this is now automatically archiving. Whenever I finished a session, I
say closed chat and it reorganized everything automatically. So this is really, Something
we did need to dive deeper into because here I can always go here. Boom. There are the different TNAs I ask
for, uh, here is the pd, the MD files. I don't have need to show this because
I can also visualize it nicely. Um, also, where is it? Maybe I find one. Here's an example of. Social images and, uh, slides that
are generated, not randomly, but based on our design identity, the design
language we have in the company. The whole team is trained on this,
and I have specific agents who are Designing the slide, we have QA
persons reviewing the things and so on. And this is not overly complex. This is how you build a proper AI team
working for you with a knowledge base. Because here is the business
knowledge management. Here are, for example, references,
reference assets, So for example, here, diagram references negative and positive. You see here, that's something I
didn't want to get and here is, are examples of something that worked well. So this is how I train the team over time
to create me better output over time. And this is the thing where the
persistent memory keeps growing. They use this as an example or here
daily reports that we generate that get sent out via PDF files and so on. I don't need obsidian for this. Look, I can visualize the images. I have full access to the files
that are relevant to this. All the things, and this is a very
specific setup here for our business. And I showed you previously that
for my personal thing, I have a complete different setup, but here,
for example, the business AI team is not only accessing this local
information locally, right in a folder. It's also connected to our actual
databases, to our membership platform. We have an AI assistant working
inside the membership platform. Answering questions because it has a
knowledge about our nearly thousands of videos and articles and podcasts and
coaching sessions that we had of with our clients that this knowledge, our AI
is leveraging to give the best answer possible and create new articles, new
videos, and things like this out of it. And this is exactly .
What Andrej is referring here to,
That he might hit a wall when he gets bigger with the rec system. And that's the case for us
because our words are go more than millions and millions of words
that we have there, obviously. And this is where. You need a rec system for AI to
understand what you're looking for because also the moment you start having
different entities, what about here? Maybe he's focused on one specific
topic that he's researching about, but what about if you have 20 different
projects running and you need to understand the different knowledges? I'm pretty sure AI gets confused
very quickly if you don't, from the ground up, build the system
properly to make AI understand. Where it finds the different things. And that's why there's no mention
of an AI team here, and I think it's essential to have this from the get
go Because if you go to my ico.com and you go to team, you see exactly the
team that I'm working with every day. It's me. It's our co-founder, PA ero,
and nobody else in the business. This is the crazy thing. AI completely replaced human beings
except the two of us in this. business. That doesn't mean Paco has four other
businesses with over 70 people working. But for our particular use case here,
this is just the two of us and the team. And you see here, this is
Larry the orchestrator. And you know, I made this up with
the, with the animal faces and so on. This is something visual,
but I like it too. To visualize my agents this way,
and Larry is just an orchestrator. So this looks fancy here,
but what it really looks like is  this. I launch Claude, I hit slash Larry. And what this does, it loads in the
instructions about who is Larry. Okay? Larry is the orchestrator. He's not allowed to do any work. He just needs to understand what I ask
for, and then he delegates the work to the team members who are all in there. So therefore there's an index. So Larry has the full understanding
of all the capabilities the team has. And if there is no specialist to work
on the request that I handed in, he will reach out to Nolan, who is our HR
person, to hire a new person, uh, in order to do the work best way possible. This allows me now for the different
workflows, to optimize it to the maximum and make very specialized. Team members. So he has checks and he has, you
know, he has his own PKM inbox, he has his own inbox, he has
commands that looks very complex. Now, this is how you end up when
you really go deep into this. That's not something I say that you
need, but even if you would use obsidian, you might end up leveraging a team like
this and have it running in obsidian. That's not the point here. The point is that people still don't
get the point how to manage ai. Agents and get the most out of
your knowledge base over time. And as you can see, here's the
Claude file and here are all these dedicated Claude , files. However, everything is separate
that this is just a local folder with the team things in there. So this means I can now bring in gem. And call Larry and it will work with just
a Gemini brain instead of a Claude brain. And the, the rest remains the same. I can ask Larry now. And I say, What's the latest
Comment in my eye Core. and here, you see, he's rooting to checks. He is the community agent. Okay? He knows that he's the guy who has all
the understanding about the community. And if we go to the team, here is Jack. Okay? The community manager. And if we go back to the
website, here is Jack. That's him. That's how we visualize him. He's 24 7 community manager
and he, he have all who he is. Why he joined the team and all
the things, the identity that we they gave gave them themselves. And if you watch my previous
video, you know that There's even a Easter egg here, pub night. And there you see they went out in London
having a party together, and that's where I just told them, go out, have
fun and come back with images from your party of this evening where they had
a pub grow from one pub to the other. And this is the fun thing behind
this where I really think. This is where it shows that a system
is working because they really identify and everything is consistent over time. and now we're going back here. You see he's going now to super base,
which is the backend of our community. Jacks is now fetching this, and
we see now here one hour ago. Here's the full comment. Here's the link. I can click the link. And it opens up the community
and scrolls to this comment. And here it is, two hours
ago, there's this comment. that we see and you see I access the community
and the comment, which is a whole knowledge base on a server elsewhere. Localized accessible through my team
on my local machine to work on this. Guys, this is what, you can do when
you really leverage AI in the best way possible for knowledge work that goes way
beyond just asking a few Wiki articles and creating some, articles out of it. That's what is useful, no doubt, right. But when it really comes to saving
money and, being efficient and more productive and then people
say, I'm not more productive with AI and this is all they do, then
you don't get the point behind ai. And that's what we are
here for, to teach this. And, obviously no offense against
Andrej or what he shared here. I think it's important that he brought
this up and what is possible nowadays, but it goes so much more beyond. Without adding another layer of
complexity, in my opinion when it comes to using obsidian on top of it. I also saw this comment from Ola, Why would I use obsidian when I can't
just use Claude code for a knowledge base? What's the advantage? And I, I want to dive into this
quickly too, because he asks absolutely the right question. But the comments below this is, uh,
is surprising because it seems people don't get the point I see here. Why do we use cars when we can walk? I tell you, maybe it's better to walk
for some people so they get to the destination instead of getting in a car
and have no clue what the signs on the street means, and you build a crash and. Then you can not drive a car anymore. So get your driver license
first before you get into a car. That's what I would say. And you rather walk to the destination. You understood the
whole path towards this. So next time you say, man, but
I would be faster using a car. And then you get a car and I'm pretty
sure this car won't be named obsidian. But if you go here, you know there are so
many people saying, yeah, perfect example. No, because he gets it right. This statement makes
no sense or connection. Why not use MD files in a directory? Exactly. Why not? You can use it in a directory so that the
folder becomes the car and not obsidian. Obsidian is not the car. Obsidian is just. The brand of the car, I would say, ? So
you can use different brands of a car, but in the end it's just getting from point A
to point B. And you're not faster at all. This way, the, the, the compute, the
comparison is just nonsense in my opinion. We see here, Claude code
is not a knowledge base. Claude code would be using
obsidian as a knowledge base, not you, so you can look at it. And change stuff. No, I agree. Claude code is not a knowledge base. That's what something
many people get wrong. , they have a conversation with a chat
bot and they think that's now their PKM system, that's nonsense because you don't
want to search through your chats to find the information later on, however. Obsidian is not your
knowledge base Either. What is your knowledge base? It's the local folder that you've
created, and as I have shown, you can open this folder in vias code, and
this is natively, or you open it up in obsidian and it will alter your. To the way so it can be
shown inside obsidian. And I think that's a big Distinction here. But he's right. Obsidian is nothing more than the reader. All this has nothing really to
do with obsidian, but more about organization, and I agree with this. If you don't want to create an
interface, you know, or let, Claude create an interface for you and you
want to have something, then obsidian is the thing that gets closest to use. I just want to make you aware. You need to set up the files in a way so
obsidian can actually use it properly. Obsidian is just permanent
storage that sinks everywhere. Claude code loses context
when you lose the tab. But yeah, if you're just
dumping stuff in for a single session, Claude Code works fine. What the heck? No, it is the local folder. Right. And what we need to understand
here, that's correct. He refers here to Claude Chat if you use
Claude code, it always will generate a Claude, that MD file and things like this. So that's not even true. But you could say chat,
GPT Chat, for example. And even there is persistent
memory, this being said. I am using only Claude code and VS. Code to visualize. And a local folder. I could even use only the local folder
as I showed you in a one hour video how I set this up, just using a folder and
Claude code to build up this AI team from scratch, and the three agents that
you really need to run the whole thing. And I'm not going deeper in this here, but
if you really want to see proof that this works in a much more simple way, watch the
video next Then let me know in this other video if it is more or less complicated,
what we see in here, you will see I literally just use a local folder and
Claude code in a terminal and this is it. And we have in the end of the
video an interface showing you the knowledge in a beautiful way, in
a way that you personally like it. And if you're interested. To really master all these things, you
can join us inside my icorp, where we have monthly workshops and weekly coaching
sessions with Parker and me, where we help you to set this up for your own use case
and your businesses that go way beyond. Then just asking your knowledge
base about specific questions. And actually start leveraging
your knowledge to take actions on these things and actually make
actual workflows in your business. Easier. So it's not about only
knowledge management. It's, as I said, mentioned in this
video, scanning documents, organizing these documents, but then also track
record of did I pay this invoice or not? how much expenses did I
have from these invoices? It's accounting, man. All these things is something that
probably most people are not aware yet. Is possible and it's all
possible on a local folder. That's the crazy thing that happened
in the beginning of this year. Alright guys, I hope this was insightful
and let me know in the comments below what you think about all this. I catch you up in the next one.
