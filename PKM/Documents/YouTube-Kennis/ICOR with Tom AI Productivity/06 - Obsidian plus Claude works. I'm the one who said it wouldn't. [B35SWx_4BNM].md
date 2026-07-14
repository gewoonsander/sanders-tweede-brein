# Obsidian plus Claude works. I'm the one who said it wouldn't.

- **Video:** https://www.youtube.com/watch?v=B35SWx_4BNM
- **Ondertitel-taal:** en
- **Bron:** YouTube-ondertitels

---

If you watch the previous videos, you
know that we can build a local folder and use AI for knowledge management,
and I made a few videos about why you don't need to use Obsidian to do that. People say, but I love using obsidian
with this, and this is great. And this video I will show for those who
are interested in using Obsidian exactly step by step, how you set these things up. However, the point was in the previous
videos  that there is no need. To use Obsidian in order to leverage
AI for knowledge management. It is another layer on top, and I just
had a feeling that people think they need to use Obsidian in order to do this. However, in this video you will see that
it actually can be very useful using obsidian on top of your local folder
as one of the options that you have. To access and visualize the
data that you're creating. So in the end of this video, you
will have everything set up, end to end, you have a system running. And as you know me, it will be
the most simple way to do it. Alright, the important thing is just
that you are on version one point 12.7 which will ensure that you have
installed the obsidian CLI don't worry if you don't know what this is. the CLI will just allow you
to access your obsidian files. Through the terminal and we will end up
letting Claude use this connection for us. So we don't need to know how it works,
But essentially it provides a lot of different commands that Claude can
now use to effectively use Obsidian without it, even then Claude would
be able to manipulate our local files so it shows up properly in obsidian. But this is the most
efficient way to do it. So just for information. So just ensure that you
updated obsidian to the latest version and you're good to go. If not, just download it and install it
and you will be on the latest version and everything will be set up properly. So now we will start an empty vault. And a vault for those who don't
know, never used obsidian. A vault is just, again, a local folder. So we will see when we create now a
new one, we call it obsidian demo, and we check out the, the location again. I always like for these demos, to use
the desktop because this way you see, it's actually a local folder that
siding creates Here, if If you open up this folder, you see all there
is, it's now a dot obsidian file. If you're using Claude, you're
getting used to these things because there's also.cloud folder. And in there there is the instructions
for obsidian, how to read this folder and to visualize it. And here is the first.md
that obsidian creates. If we open up this, this is all there is. It's just some information
and that's it to get going. Okay. Again, we are working on a
local folder and that's great. If you watch the previous videos,
you know what these two folders are. We always worked with Claude in
just local folders and we built our knowledge base this way and the
same we will do now with obsidian. That's the beauty about obsidian. So you see this folder is
now open in our obsidian app. And you see here, there's
the welcome MD file. Again, if you show here, there's
the MD file, it's showing up here. It shows you the local structure. What it doesn't show you is these
hidden folders, and if you don't see the hidden folders, you can hit
shift command.to show or hide them if you cannot see these folders. But now let's stay here. So it created this message and
we have the graph already, and I will just close all these things. And now let's set up obsidian
in a way that we can use one way to access this would be. I just right click on this folder
and I can go to services and say, new terminal at folder. There we go. There are many ways to do this. You could also get into the folder
by right clicking, holding down option and copy the path name
and then hit CD and the path. Name many ways, how you can open
a terminal inside this folder. All it does now is when we open
this folder again, This terminal is now active in this folder. if I now launch Claude in this
terminal, it will start working in here. So I can now say create a new MD file
in this folder with random text in it And now you see Claude just
created a random notes file. If I open this here, this is
what it created now if we open up obsidian again, you see now there
is also this random notes coming up and I can read this in a much. A nicer way than just opening
up the m the file natively. Okay, so this is how you could
already work in your obsidian vault, but I don't see the point in
doing so, and that's what I mean. If you want to just have it this way,
you can perfectly just use the terminal in a folder or vs code as I showed in
another video to have even more access. In this video, I will show
you how I would use obsidian together with Claude properly. So we close this terminal. Now we have this folder. Let's go back to obsidian. And what I want is I want to
have Claude inside obsidian. I saw some people using VS
code with Claude on the side working inside the folder. And so, no, I want to have the feeling
that Claude is working with me inside. And that's the reason
why I'm using VS code. And that is the reason why I
will also use it inside Obsidian. And in order to achieve this, we will
just need to get one community plugin So if you go to settings of obsidian and we
go to community plugins, we can turn on community plugins here, then we browse,
and here we just write down terminal. And there you see there's a
very popular one with over a hundred thousand downloads. I click on this, I install it. I enable it, and then you can,
if you want, go to options and getting overwhelmed. Just ignore it, close it. And what this type plugin actually
does, it allows me to load the terminal inside obsidian. So you get this new icon here, you
click it, and then you say integrated, and it opens up a terminal in here. I prefer to have it on a sidebar. So therefore, obsidian gives us
the options we have already the sidebar with these different topics. The nice thing about obsidian, I can
place these things anywhere I want. And now I have the terminal
opened here on the side. I have here my notes. I have here the content to show when I
click, I can switch between the notes. I can hold down command and
open up nodes in different tabs. And that's actually
really a nice interface. and I really like it this way. So now let's start working
on our obsidian vault. I will just launch Claude now
as this is just a terminal. It perfectly launches Claude and
the beautiful thing is if I launch it Inside obsidian in the open
vault, you see it automatically launches it inside this folder. So there's no need to drag and drop
a folder in, as I showed you before. It instantly opens up and I can
start working inside my vault. so let's give it a go And I
will say, delete the two nodes that we have in this folder. All right. You see, it recognizes there
are two markdown files and it's not possible to undo this. So should it Go ahead. Yes. Delete it and it will
delete these demo files. And there we go. It's gone. So this means we perfectly
can work in here. So now I can say slash in it, this will
initialize Claude inside this folder. Not really necessary, but
it's a good starting point. So it will now recognize that
it is in an obsidian folder. see it recognizes this
directly as an empty obsidian vault, not a code repository. So it sets itself up. So he says it makes no sense
to create a  Claude aut defi. So the interesting thing is here, even
that it knows that we are an obsidian, it doesn't know yet that it can use
the obsidian CLII  so this time I asked it, can you use the obsidian CLI? And it actually figured it out. However, beware this
is not always the case. I tested it before and I asked, can you
access the obsidian CLI, which is the connection to obsidian that I showed
you in the beginning of the video. And there it said no if this is the case, just tell it. is an obsidian CLI and it should
double check and things like that. And it knows. So what we want, we want to make
Claude now much more aware of what environment he's working in. That's why we will say create a Claude or the D file. Which will remind you that you are
now in an obsidian environment and you have full access to the obsidian
CLI and that you can access any tasks and commands through the CLI to use
obsidian in most efficient way possible. So obviously I just say something
random, not very well said. The beautiful thing about AI is it will
create now a Claude of MD file that's more helpful to AI than whatever I said here. So let Claude make it. You see it said it created it. It created this file. Here we can open up the plot of MD file. And there we go. Here we are. If we now open up this folder
again, we see here's the obsidian and there's the cloud MD five. So what did it create? All this, that there is an obsidian
CLI, how to access it and all the information that it needs here. Now it knows the capabilities
available via the CLI. So whenever I ask now, Claude
something, it perfectly will understand how to use the CLI. Again, remember, it's just. The connection to obsidian that
allows now c interact with it. And it's also for yourself to understand. So what we don't have in here, there
is no capabilities of canvases, but even this is possible to use. And I show you in the end of the video, okay, now that we have this
in place, we are good to go. That's the basics that we need. So we can just hit slash clear
so we have an empty context for Claude and we can get started. And the first thing I want to do is. Backfill the daily journal entries for
the last 30 days with random entries about different people and different topics, and
already create backlinks to each other. So we have already a starting
point for our journal, whatever. Okay, so obviously it would be your
own journal entries that you're doing here, but I just want to show you
something that we can work with inside obsidian and how I would approach it. So if I bring in my knowledge into
obsidian, I would approach them this way. So now you see it is
using the obsidian CLI. As you can see here, all this
looks very complex, but in the end it is really simple. It just calls now, um, the
obsidian CLI and it starts. To figure out what I actually meant
by this and where the path is and so on, and eventually it will start
creating these journal entries. And here we go. We see it already created a people
folder where we have now the different people that it's generating, and we
have some notes about the people in here as a starting point, and then I will
create these journal entries about it. Now here we have topics. So we see already that here we have the
book club and there's a person mentioned. We can always go to the three dots
and say backlinks and document. And now we see the backlinks down here. So we see that this person
has an entry from book club. If you click, we can open up
this person's note and see. There's this link to the book
club, but also the Italy trip. So if you click here, we see it here. We can also go to the knowledge
graph and see how the connections are building up because now the
daily entries are coming in. And there we go. You see here the links are working. I can click on it, I can open
up, it opens up in the site. It's beautiful. I see now all the daily entries and it
obviously that's not something we want. We want to have a folder
for our daily journaling. I could go now to the settings and set
this up, but that's the beautiful thing. Now I can ask it. I'd like to have all the daily
journal entries into one journal folder and all new ones should also
go into the folder, so ensure they'll also set up the settings correctly. So what this will do, he will now move
everything into the folder, but also go into the settings and sets it up for me. He probably will tell me he has no
access to it, and yet what he has is access to the folder so he can actually
access the settings files here in order to set this properly up for me. Because obsidian is it's a pretty simple
way to manipulate obsidian files and therefore we have Claude doing it for us. See now it moved it everything into the
journal folder here, and if we right click, we can always open the folder
by clicking on Reveal and Finder. And here we are now we have these folders
in here and you can see it's a perfect replica of what we have obviously,
because obsidian is just an interface visualizing my data from my local folder. And that's something I saw previously
using this terminal integration. Claude crashes and the reason why
it crashed, it reloaded obsidian. See, and when it does,
it loses the session. That's the thing. Just keep this in mind. If you reload it, that's how you get back. You just launch Claude resume and
then you can actually get back to the session that was just closed. That's one thing that might people say,
ah, but I prefer using it externally because then it will always stay open. I have no problem because even if
you have several terminals running, you can always hit slash rename and
this will now rename this session to, uh, to whatever we are working on. So now if I get a crash, so here
I will just exit it and it Right. Clear. So now it's like we crashed. I can now launch Claude, but I also
can launch Claude with resume here this way and it will directly go here. And I see organized daily journal
notes  and I know I'm back in this conversation now, and that's how I can
stay always in control whenever something happens to my conversation with it. All right, great. Now we have the journal entries, we have
the people folder, we have topics folder. But the beautiful thing about obsidian
is that we now have even databases. So let's create an actual people base. Okay? So that's what we can say now
that we have people in there. Can you create a people base that includes also additional
metadata about these people? So you can see already there
is no base creation thing, but there's no problem for Claude. It will just create it anyway. And then later on it will use the
CLI to keep adding more things. And here we go. It already created a table. And now we have this base here, which he also created in a people folder. So now we could have also a base
folder where we have all these bases, and that's up to you how
you want to organize this properly. But here we go. It added tags. It added last contacted location,
uh, relationship, fire name. And that's beautiful. And obviously now you have the option
that to much easier manipulate the files. You can write anything down here and
you can upgrade your obsidian to sync it so you have access to it from anywhere. But now let's move things further. now I, show you how powerful this
now becomes because we have these journal entries and that's the perfect
way now to create a daily journal. So I can actually always provide images
in here and I will use this beautiful comment that I got on one of my videos. To create a journal entry out of
it, please create a journal entry out of this screenshot and I paste
and copy paste the image in here. So that's just copied in from
my clipboard and it is just represented as image number one. What Claude will do now, it will read
this image what's on there, and you will see it in a minute appearing,
and it will create a journal entry. However, what I didn't say is that it
should also add this image to the entry. So it probably will just
create an entry for now. And that's a perfect example to
show you how you further can improve your Claude setup Inside obsidian. So, it created, now this
file, I can open up the thing. So if I go here, open
today's daily journal. Here we go, a comment that landed, and
here it says all the information about it. And now I can actually quickly go out
here, which is just by hitting exit. You're back in the terminal. I hit clear, it will empty the terminal. And instead of just using Claude,
I will use Claude and then I will use Claude. And then this flag behind
dangerously skip permissions. If you do this. Claude will just skip everything
that you get asked for each change inside the file and all the things. Be careful, depends on
what you're working on. Uh, I'm pretty fine
with this in most cases. so I'm using this now. And if you are unsure for certain things,
the beautiful thing is if you launch it this way, you still can by using
shift tab to cycle through the modes. This is now empty and it
will ask me for everything. This will accept edits on, so this will
automatically accept the edits that I already agreed on, that it will be okay. the plan mode, something I will discuss
in a different video where it's not doing any edits, but it creates a plan for the
things that it is planning to carry out. And now this, okay, so we
will stay in this now for now. I resume the session again. And now we are back here. See, and now we can go back and say,
but I also want the image to be appended to the note. let's see if it still has access to it. And there we go. See, here's the image that
I shared with obsidian. It added it, it created an at
attachments folder where it saves all the images and, and this is it. Now we have it all. We have the image itself, and we have now
the journal entry two, but I don't want to keep repeating this over and over. Okay. So first of all. I want Claude to remember. please remember how we
created this journal entry. Whenever I provide you a screenshot
and ask you for creating these entries, update you, Claude at md file accordingly. now it'll go into this cloud file and
it will update it with this information. However, that's not the
way I like to do it. I. Now we see it added information
into this Cloud MD file, daily notes where they live and so on. And here creating a journal entry
from the screenshot and took nice thing again in obsidian. I can now easily edit this MD file. Also, obviously you could do this in VS. Code two. And there we go. Now we have it. However, I want to have it even
simpler whenever I have something I want to add to the journal. So now when we open up the folder. In the meantime, it created a dot
Clause MD file, and there are some settings that it's set up already. Now we could install a  show,
hidden folder plugin and things like that to show them here. But I don't want to add, you know,
more plugins than and really necessary. So I will stay with this
terminal plugin here. Instead, I will just tell Claude
to create a command and for me. So I can easily trigger this
journal entry moving forward. So what is a command? A command is just a simple file like this
one where there's just a prompt saved. So if we scroll back up and we remember
this, this was actually the prompt. So all we need is,  create a slash
command for me that I can use to trigger this in the future. Name it. Journal entry with this prompt, actually journal entry, journal image entry with this prompt. And then I just see if Claude will
actually create it, because the good thing is we always have easy access
on our finder to see what's going on in our files and what it should do. Now it creates another folder in
here called commands, and in there is just a simple text file with my
prompt that is then easy to access through the terminal moving forward. So you see it just created commands. And now it will create this file in there. There we go. Here's this command. It can open this up. And this is it. See, there's a description. It created, it created this,
and then it even expanded it so it really knows what to do. And the beautiful thing is when we have it
this way, next time, let's clear all this. So we start from scratch with, Claude. and in fact, I will go to our, myICOR
application because there was a beautiful comment on our free Kickstarter
course from Steven here that after 81 years he finally gets a system. So I will just make a screenshot. I go back to obsidian  and
I now hit slash journal. I. And if this is not coming up yet,
you might need to restart cloud. So I will exit it clear,
restart it this way. And I'm just clearing because I
want to have it clean visually. And now I have journal, see image entry. I can hit tap. And now I just paste in this image. And this is now a combination of all the
prompts that you saw in this MD file here. So when I hit enter, all it does,
it just reads this file and this is the prompt that's going on. It'll copy the import
image into the attachments. It depends it to today's daily
node, it will add and so on. Okay, so let's see how this
works and how more efficient we already are doing this, this way. And here we go. It added it to journals. So open up the journal and we
see here, now there's this entry. And it worked beautifully. It added the image, it extracted it, it
extracted also what this is all about. It compared it even to the previous entry. And this is actually pretty be beautiful. And I think you see now the power
of commands, How fast you can now create these journal entries. it actually recognized itself
that there is a name and it wasn't added, so why not adding it? Yes. Update your rule set to always also
cross link any new people appearing or link existing people. It created Steven, it put it
outside of the people folder. Again, you need to update the rules. Ensure moving forward, all
people get moved into the people. Folder and if you open up the
people base, you see that Steven doesn't appear here either. Also ensure to add those
people to the people base, and if you want to more be more specific,
you can then go into Claude lot. There we go. He edited ICOR. User location, unknown. Obviously I can click on it. Now we have the metadata we have
here, the information we have here, the daily entry, connected. And all this is working beautifully. So the last thing I want to show you
is  how we can actually create canvases. So I can just say  create
a canvas with a random. Diagram on it. So it will now say, and
I even misspelled it. And that's the nice thing AI will
still understand what I mean. but the thing is canvases is not part
of the CLI, so it will try now to find it and it will say it's not there. However, Claude is pretty clever and
it knows that canvases are just chasing files and will create it manually force. And again, once we get this and
it is doing the right thing, we could reinforce it by updating
the Claw MD file So here we go. I will write the Canvas file directly. Boom, I did it. And here. It created this canvas. With this, there we go. It created all these nodes I have
here, even a link to something. And this works pretty good. So now I could also add the image here and
I can start thinking so I have a visual representation and think about the stuff. This is great, and now I can
have my articles in there and so on, and extract it to create
a visual representation of it. And that's actually pretty good. now you can imagine, I will now say,
create a folder for the canvases and we can also apply the I core, my life
concept here and also the AI agent team to make it an efficient PKA System a
Personal Knowledge Assistant System that is easy to interact with without
a need for Claude for you to create interfaces or anything like this. So that's really powerful using
of obsidian, I hope you see that I'm not against obsidian at all. It is just another layer that we now put
on top of what we've built previously in our local folders, and, now we can
use obsidian to access it this way. But I hope you also see the advantage of actually setting
it up this way so you have easy access with Claude to your
files and how you work in there. Let me know in the comments below if you
are already using obsidian with Claude and if this is the way how you do it. And I'm happy to make a follow up
video to show you now how we can integrate actually AI agents working
in there, Larry and the team and so on. so if you haven't already,
subscribe to the channel and I catch you up in the next one.
