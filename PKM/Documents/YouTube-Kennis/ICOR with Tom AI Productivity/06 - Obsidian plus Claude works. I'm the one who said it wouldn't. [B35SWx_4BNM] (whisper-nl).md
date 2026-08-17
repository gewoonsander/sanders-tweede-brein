# Obsidian plus Claude works. I'm the one who said it wouldn't.

- **Video:** https://www.youtube.com/watch?v=B35SWx_4BNM
- **Ondertitel-taal:** nl (Lokale Whisper-transcriptie (large-v3), geen ondertitels beschikbaar)
- **Bron:** Lokale Whisper-transcriptie (large-v3)

---

If you watched the previous videos, you know that we can build a local folder and use AI for knowledge management.
And I made a few videos about why you don't need to use Obsidian to do that.
People say, but I love using Obsidian with this and this is great.
And in this video I will show for those who are interested in using Obsidian exactly step by step how you set these things up.
However, the point was in the previous videos that there is no need to use Obsidian in order to leverage AI for knowledge management.
It is another layer on top.
And I just had a feeling that people think they need to use Obsidian in order to do this.
However, in this video you will see that it actually can be very useful using Obsidian on top of your local folder
as one of the options that you have to access and visualize the data that you are creating.
So.
In the end of this video you will have everything set up end to end.
You have a system running and as you know me, it will be the most simple way to do it.
Alright, the important thing is just that you are on version 1.12.7, which will ensure that you have installed the Obsidian CLI.
Don't worry if you don't know what this is.
The CLI will just allow you to access your Obsidian files through the terminal and we will end up letting Claude use this connection for us.
So, we don't need to know how it works, but essentially it provides a lot of different commands that Claude can now use to effectively use Obsidian.
Without it, even then Claude would be able to manipulate our local files so it shows up properly in Obsidian.
But this is the most efficient way to do it.
So, just for information.
So, just ensure that you updated Obsidian to the latest version and you are good to go.
If not, just download it and install it and you will be on top of it.
So, now we will start an empty vault and a vault, for those who don't know, never used Obsidian, a vault is just again a local folder.
So, we will see when we create now a new one, we call it Obsidian Demo and we check out the location.
Again, I always like for these demos to use the desktop because this, you see, it's actually a local folder that Obsidian creates here.
If we open up this folder, you see all there is.
It's now a .Obsidian file.
If you're using Claude, you're getting used to these things because there's also .Claude folder.
And in there, there's the instructions for Obsidian, how to read this folder and to visualize it.
And here is the first .md that Obsidian creates.
If we open up this, this is all there is.
It's just some information and that's it to get going.
Again, we are working on a local folder and that's great.
If you watched the previous videos, you know what these two folders are.
We always worked with Claude.
We worked with Claude in just local folders and we built our knowledge bases that way.
And the same we will do now with Obsidian.
That's the beauty about Obsidian.
So you see this folder is now open in our Obsidian app.
And you see here, there's the welcome .md file.
Again, if you show here, there's the .md file.
It's showing up here.
It shows you the local structure.
What it doesn't show you is these hidden folders.
And if you don't see the hidden folders, you can.
Hit shift command dot to show or hide them if you cannot see these folders.
But now let's stay here.
So it created this message and we have the graph view already.
And I will just close all these things.
And now let's set up Obsidian in a way that we can use Claude.
One way to access this would be, I just right click on this folder.
And I can go to services and say new terminal at folder.
There we go.
There are many ways to do this.
You could also get into.
The folder by right clicking, holding down option and copy the path name.
And then hit cd and the path name.
Many ways how you can open a terminal inside this folder.
All it does now is when we open this folder again.
This terminal is now active in this folder.
If I now launch Claude in this terminal, it will start working in here.
So I can now say create a new .md file in this folder with random text.
And now you see Claude just created a random notes file.
If I open this here, this is what it created.
And now if we open up Obsidian again, you see now there is also this random notes coming up.
And I can read this in a much nicer way than just opening up the .md file natively.
Okay.
So this is how you could already work in your Obsidian vault.
But I don't see the point in doing so.
And that's what I mean.
If you want to just have it this way, you can perfectly just use it.
The terminal in a folder or VS Code as I showed in another video to have even more access.
In this video I will show you how I would use Obsidian together with Claude properly.
So we close this terminal now.
We have this folder.
Let's go back to Obsidian.
And what I want is I want to have Claude inside Obsidian.
I saw some people using VS Code with Claude on the side working inside the folder.
And so now I want to have the feeling that Claude is working.
So I want to have Claude with me inside and that's the reason why I'm using VS Code.
And that is the reason why I will also use it inside Obsidian.
And in order to achieve this, we will just need to get one community plug-in.
So if you go to settings of Obsidian and we go to community plug-ins, we can turn on community plug-ins here.
Then we browse and here we just write down terminal and there you see there's a very popular one with over 100,000 downloads.
I click on this.
I install it.
I enable it.
And then you can, if you want, go to options and getting overwhelmed, just ignore it, close it.
And what this plug-in actually does, it allows me to load the terminal inside Obsidian.
So you get this new icon here.
You click it and then you say integrate it and it opens up a terminal in here.
I prefer to have it on a sidebar.
So therefore Obsidian gives us the options we have already in the sidebar for the different topics.
The nice thing about Obsidian, I can place these things anywhere I want.
And now I have the terminal opened here on the side.
I have here my notes.
I have here the content to show.
When I click, I can switch between the notes.
I can hold down command and open up notes in different tabs.
And that's actually really a nice interface and I really like it this way.
So now let's start working on our Obsidian Vault.
I will just launch Claude now.
As this is just a terminal, it perfectly launches Claude.
And the beautiful thing is if I launch it inside Obsidian in the open vault, you see it automatically.
It automatically launches it inside this folder.
So there is no need to drag and drop a folder in as I showed you before.
It instantly opens up and I can start working inside my vault.
So let's give it a go.
And I will say delete the two notes that we have in this folder.
All right.
You see it recognizes there are two markdown files and it's not possible to undo this.
So should it go ahead?
Yes, delete it.
And it will delete these demo files.
And there we go.
It's gone.
So this means we perfectly can work on this.
We can work in here.
So now I can say slash init.
This will initialize Claude inside this folder.
Not really necessary, but it's a good starting point.
So it will now recognize that it is in an Obsidian folder.
See, it recognizes this directly as an empty Obsidian vault, not a code repository.
So it sets itself up.
So he says it makes no sense to create a Claude.md file.
So the interesting thing is here, even that it knows that we are in Obsidian, it doesn't know yet.
Yet that it can use the Obsidian CLI.
So this time I ask it, can you use the Obsidian CLI?
And it actually figured it out.
However, beware, this is not always the case.
I tested it before and I asked, can you access the Obsidian CLI, which is the connection to Obsidian that I showed you in the beginning of the video.
And there it said no.
If this is the case, just tell it there is an Obsidian CLI and it should double check and things like that.
And it knows.
So what we want, we want to make Claude.md.
Claude now much more aware of what environment he is working in.
That's why we will say create a Claude.md file, which will remind you that you are now in an Obsidian environment and you have full access to the Obsidian CLI and that you can access any tasks and commands through the CLI to use Obsidian in the most efficient way possible.
So obviously I just say something random, not very well said.
The beautiful thing about AI is it will create now a Claude.md file.
It is more helpful to AI than whatever I said here.
So let Claude make it.
You see it said it created it.
It created this file here.
We can open up the Claude.md file and there we go.
Here we are.
If we now open up this folder again, we see here is the Obsidian and there is the Claude.md file.
So what did it create?
All this, that there is an Obsidian CLI, how to access it and all the information that it needs here.
Now it knows the capabilities available via the CLI.
So whenever I ask now Claude something.
We will understand how to use the CLI.
Again, remember it's just the connection to Obsidian that allows now Claude to perfectly interact with it.
And it's also for yourself to understand.
So what we don't have in here, there is no capabilities of canvases, but even this is possible to use.
And I show you in the end of the video.
Okay.
Now that we have this in place, we are good to go.
That's the basics that we need.
So we can just hit slash clear.
So we have an empty context.
For Claude.
And we can get started.
And the first thing I want to do is backfill the daily journal entries for the last 30 days with random entries about different people and different topics and already create backlinks to each other.
So we have already a starting point for our journal, whatever.
Okay.
So obviously it would be your own journal entries that you're doing here, but I just want to show you something that we can work with inside Obsidian and how I would approach it.
So if I bring in.
My knowledge into Obsidian, I would approach them this way.
So now you see it is using the Obsidian CLI, as you can see here, all this looks very complex, but in the end it is really simple.
It just calls now the Obsidian CLI and it starts to figure out what I actually meant by this and where the path is and so on.
And eventually it will start creating these journal entries.
And here we go.
We see it already created a people folder where we have now the different people that it's generating.
Okay.
And we have some notes about the people in here as a starting point, and then I will create these journal entries about it.
Now here we have topics.
So we see already that here we have the book club and there's a person mentioned.
We can always go to the three dots and say backlinks and document.
And now we see the backlinks down here.
So we see that this person has an entry from book club.
If we click, we can open up this person's note and see.
There's this link to the book club, but also the Italy trip.
So if we click here, we see it here.
We can also go to the knowledge graph and see how the connections are building up because now the daily entries are coming in.
And there we go.
You see here the links are working.
I can click on it.
I can open up.
It opens up in the site.
It's beautiful.
I see now all the daily entries.
And obviously that's not something we want.
We want to have a folder for our daily journaling.
I could go now to the settings and set this up.
But that's the beautiful.
Thing.
Now I can ask it.
I like to have all the daily journal entries into one journal folder and all new ones should also go into the folder.
So ensure they also set up the settings correctly.
So what this will do, he will now move everything into the folder, but also go into the settings and sets it up for me.
He probably will tell me he has no access to it.
And yet what he has is access to the folder.
So he can actually access the settings files here.
In order to set this properly up for me.
Because Obsidian is a pretty simple way to manipulate Obsidian files.
And therefore we have Claude doing it for us.
See now it moved everything into the journal folder here.
And if we right click, we can always open the folder by clicking on reveal and finder.
And here we are.
Now we have these folders in here and you can see it's a perfect replica of what we have.
Obviously because Obsidian is just an interface visualizing my data.
From my local folder.
And that's something I saw previously using this terminal integration.
Claude crashes.
And the reason why it crashed, it reloaded Obsidian.
See, and when it does, it loses the session.
That's the thing.
Just keep this in mind.
If you reload it, that's how you get back.
You just launch Claude, resume, and then you can actually get back to the session that was just closed.
That's one thing that might people say, ah, but I prefer using it externally because then it will always stay.
Open.
I have no problem because even if you have several terminals running, you can always hit slash rename.
And this will now rename the session to whatever we are working on.
So now if I get a crash, so here I will just exit it and write clear.
So now it's like we crashed.
I can now launch Claude, but I also can launch Claude with resume here this way.
And it will directly go here.
And I can see organize daily journal notes.
And I know I'm back in this conversation now.
And that's how I can stay always in control whenever something happens to my conversation with it.
All right, great.
Now we have the journal entries.
We have the people folder.
We have topics folder.
But the beautiful thing about Obsidian is that we now have even databases.
So let's create an actual people base, okay?
So that's what we can say.
Now that we have people in there, can you create a people base that includes also additional
metadata about these people?
So you can see already there is no base creation thing, but that's no problem for Claude.
It will just create it anyway.
And then later on it will use the CLI to keep adding more things.
And here we go.
It already created a table.
And now we have this base here, which he also created in the people folder.
So now we could have also a base folder where we have all these bases in.
That's up to you how you want to organize this properly.
But here we go.
It added tags.
It added last contacted, location, relationship, file name.
And that's beautiful.
And obviously now you have the option to much easier manipulate the files.
You can write anything down here and you can upgrade your Obsidian to sync it.
So you have access to it from anywhere.
But now let's move things further.
Now I show you how powerful this now becomes because we have these journal entries and
that's the perfect way now to create a daily journal.
So I can actually always provide images in here and I will use this beautiful comment
that I got on one of my videos to create a journal entry out of it.
Please create a journal entry out of this screenshot.
And I paste in, copy paste the image in here.
So that's just copied in from my clipboard and it is just represented as image number
one.
What Claude will do now, it will read this image what's on there and you will see it
in a minute.
And it will create a journal entry.
However, what I didn't say is that it should also add this image to the entry.
So it probably will just create an entry for now and that's a perfect example to show you
how you further can improve your Claude setup inside Obsidian.
So it created now this file.
I can open up the thing.
So if I go here, open today's daily journal, here we go, a comment that landed and here
it says all the information about it.
And now I can actually quickly go out here, which is just by hitting exit, you're back
in the terminal.
I hit clear, it will empty the terminal.
And instead of just using Claude, I will use Claude and then I will use Claude and
then this flag behind, dangerously skip permissions.
If you do this, Claude will just skip everything that you get asked for, each change inside
the file and all the things.
Be careful.
It depends on what you're working on.
I'm pretty fine with this in most cases.
So I'm using this now.
And if you are unsure for certain things, the beautiful thing is if you launch it this
way, you still can by using shift tab to cycle through the modes.
This is now empty and it will ask me for everything.
This will accept edits on.
So this will automatically accept the edits that I already agreed on that it will be okay.
The plan mode, something I will discuss in a different video where it's not doing any
edits.
It's a plan for the things that it is planning to carry out.
And now this.
Okay.
So we will stay in this now for now.
I resume the session again and now we are back here.
See.
And now we can go back and say, but I also want the image to be appended to the node.
Let's see if it still has access to it.
And there we go.
See, here's the image that I shared with Obsidian.
It added it.
It created an attachments folder where it saves all the images and, and this is it.
Now we have it all.
We have the image itself and we have now the journal entry too.
But I don't want to keep repeating this over and over.
Okay.
So first of all, I want Claude to remember.
Please remember how we created this journal entry.
Whenever I provide you a screenshot and ask you for creating these entries, update your
Claude.md file accordingly.
Now it will go into this Claude file and it will update it with this information.
However, that's not the way I like to do it.
Now we see it added information into this Claude.md file, daily nodes, where they live
and so on.
And here creating a journal entry from the screenshot and took nice thing again in Obsidian.
I can now easily edit this MD file.
Also obviously you could do this in VS Code too.
And there we go.
Now we have it.
However, I want to have it even simpler whenever I have something I want to add to the journal.
So now when we open up the folder, in the meantime, it created this .Claude.md file.
And there is some settings that it set up already.
Now we could install a show hidden folder plugin and things like that to show them here.
But I don't want to add, you know, more plugins than really necessary.
So I will stay with this terminal plugin here.
Instead, I will just tell Claude to create a command for me so I can easily trigger this
journal entry moving forward.
So what is a command?
A command is just a simple file like this one where there's just this prompt saved.
So if you scroll back up and we remember this, this was actually the prompt.
So all we need is create a slash command for me that I can use to trigger this in the
future.
Name it journal entry with this prompt.
Actually journal entry, journal image entry with this prompt.
And then I just see if Claude will actually create it because the good thing is we always
have easy access on our finder.
So we can see what's going on in our files and what it should do now, it creates another
folder in here called commands and in there is just a simple text file with my prompt
that is then easy to access through the terminal moving forward.
So you see it just created commands and now it will create this file in there.
There we go.
Here's this command.
It can open this up and this is it.
See, there's a description it created.
It created this and then it even expanded it so it really knows what to do.
And the beautiful thing is.
When we have it this way, next time let's clear all this.
So we start from scratch with Claude.
And in fact I will go to my iCloud application because there was a beautiful comment on our
free Kickstarter course from Steven here that after 81 years he finally gets a system.
So I will just make a screenshot.
I go back to Obsidian and I now hit slash journal.
And if this is not coming up yet, you might need to restart Claude.
So I will exit it.
Clear.
Restart it this way.
And I'm just clearing because I want to have it clean visually.
And now I have journal.
See, image entry.
I can hit tab.
And now I just paste in this image.
And this is now a combination of all the prompts that you saw in this MD file here.
So when I hit enter, all it does, it just reads this file.
And this is the prompt that's going on.
It will copy the image into the attachments.
It appends it to today's daily note.
It will add and so on.
So let's see how this works and how more efficient we already are doing it this way.
And here we go.
It added it to journal.
So open up the journal and we see here now there's this entry.
And it worked beautifully.
It added the image.
It extracted it.
It extracted also what this is all about.
It compared it even to the previous entry.
And this is actually pretty beautiful.
And I think you see now the power of commands, how fast you can now create these journal entries.
It actually recognized itself.
That there is a name and it wasn't added.
So why not adding it?
Yes, update your rule set to always also crosslink any new people appearing or link existing people.
It created Steven.
It put it outside of the people folder again.
You need to update the rules.
And sure, moving forward all people get moved into the people folder.
And if you open up the people base, you see that Steven doesn't appear here either.
Also ensure to add those people to the people base.
And if you want to be more specific, you can then go into Claude.
There we go.
He added it.
I call user.
Location unknown.
Obviously I can click on it.
Now we have the metadata.
We have here the information.
We have here the daily entry.
Cross connected.
And all this is working beautifully.
So the last thing I want to show you is how we can actually create canvases.
So I can just say create a canvas with a random diagram on it.
So it will now say and I even misspelled it and that's a nice thing.
I will still understand what I mean.
But the thing is canvases is not part of the CLI.
So it will try now to find it.
And it will say it's not there.
However, Claude is pretty clever.
And it knows that canvases are just JSON files.
And it will create it manually for us.
And again, once we get this and it is doing the right thing,
we could reinforce it by updating the ClaudeMD file.
So here we go.
I will write the canvas file directly.
Boom, it did it.
And here it created this canvas with this.
There we go.
It created all these nodes.
I have here even a link to something.
And this works pretty good.
So now I could also add the image here.
And I can start thinking.
So I have a visual representation and think about the stuff.
This is great.
And now I can have my articles in there and so on.
And extract it to create a visual representation of it.
And that's actually pretty good.
Now you can imagine I will now say create a folder for the canvases.
And we can also apply the I call my life concept here.
And also the AI agent team to make it an efficient PKA system.
A personal knowledge assistance system that is easy to interact with
without the need for Claude for you to create interfaces.
Or anything like this.
So that's really powerful using Obsidian.
And I hope you see that I'm not against Obsidian at all.
It is just another layer that we now put on top of what we've built previously in our local folders.
And now we can use Obsidian to access it this way.
But I hope you also see the advantage of actually setting it up this way.
So you have easy access with Claude to your files and how you work in there.
Let me know in the comments below if you're already using Obsidian.
And if this is the way, how you do it.
And I'm happy to make a follow-up video to show you now
how we can integrate actual AI agents working in there.
Larry and the team and so on.
So if you haven't already, subscribe to the channel.
And I'll catch you up in the next one.
