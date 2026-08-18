# Automate your Workflows the EASY way - Bardeen Deep Dive with Renat Gabitov

- **Video:** https://www.youtube.com/watch?v=MnwQA5AtIPo
- **Ondertitel-taal:** en
- **Bron:** Firecrawl (YouTube-verwerker)

---

hey everybody and welcome back to the
paperless Movement YouTube channel today
I'm very excited because my good friend
Reynard gabitov prepared an awesome Deep
dive into bardeen for those of you who
don't know bardeen yet it's a great
alternative to sapias apia if you don't
know what this is It's to automate tasks
and connect different tools with each
other one of the features I'm really
excited about using bardeen is to scrape
websites so this means data collection
is now easier than ever what all this
means renat will show you now so let's
dive in hello my name is renat from
Bordine Ai and it's been over a year
since the last paperless movement video
a lot has changed not just the studio in
today's video we're diving into the
icore framework and how berdin as a tool
relates to it I'll teach you how to
build AI automations scrape information
from pretty much any website and take
care of every single letter in the
i-core framework super excited let's
dive in but first what is bardeen
exactly it's a browser extension that
allows you to automate your manual
workflow so let's go ahead and add this
extension to our browser I'll leave a
link to this in the post the first order
of business let's go ahead and click on
this puzzle icon and pin the boarding
home extension so that we can open it
from anywhere with a click of a button
the first tab is called playbooks this
is what we call automations that you can
trigger with one click bardino already
comes with hundreds of pre-built
automations so what you can do is click
on this filter over here pick one of
your favorite apps such as Gmail and
find the automation that you like here
is a cool one copy all email attachments
to Google Drive sounds pretty good to me
I'll definitely want to try it out later
I'm going to click on this plus icon and
this Playbook is going to show up here
in my playbooks tab the second tab is
called Autobox those are the automations
that run periodically either when
something happens in one of your apps or
on a schedule let's click on explore
over here and browse through a list of
audiobooks for example you can send a
daily email this one sounds good as well
so let's also add this Autobook this
time to my autobooks tab you can click
on this audiobook and configure
different variables such as one in the
day to send the email their recipient
the subject line and the contents of the
email but that's for later finally you
can create your custom automation so
click on this create audiobook button
over here and then on the left side you
will see all of the available apps that
you have access to and you can click on
this plus icon to browse through
additional apps once you connected your
app you can click on one of them and see
all of the actions available with that
app you can also click on bardeen to see
all of the actions that bardine already
comes with for example I can create a
browser notification and here we have
different arguments the first one is
message I can say something like Hello
World
then we have the title okay there
and the URL tab let's do boarding AI
click on done let's click on done again
and complete our first automation by
giving it the name let's call this
notification
save and there we have our very first
custom Playbook you can click on it to
trigger it and just like this a
notification was sent hello world we can
click on the notification to open the
website
pretty cool right but there is something
that I've been itching to show you this
entire time artificial intelligence
let's open bardine with a shortcut
option b and then here in the search bar
I can type this exact automation have ai
created let's do show browser
notification
that says hello world
and takes me to
when I click on it
hit enter and boarding has built this
entire automation by itself so let's
click on yes and
let's click on the Playbook to execute
it then here we have this Playbook
executed and it works perfectly and it
works with very sophisticated
automations the ones that can scrape
information from the web so now
technically you do not even need to know
how to use those sophisticated no code
tools you can build automations by just
typing what you want done that's pardeep
now as a member of the paperless
movement you probably already know that
the tools are only as powerful as the
systems within which they operate so
let's break down bourdine within the
icore framework input control output
refine and as a quick reminder the basic
idea of icore is that there are two
worlds one with which when you think and
the other one within which you work
input this is where we take information
from the outside world and bring it into
your own world check out a couple
automations this first automation will
allow us to caption information from the
external world we can just select this
text that we're interested in right
click on it and save this to our
database in notion with one click so if
we go to a notion database here we have
the information we can process it later
and when we're done we can click on this
checkbox to get it archived here's
another cool automation to capture
thoughts on the go openboarding with a
shortcut and click on this automation to
capture idea to knowledge base you can
say something like buy milk
hit enter hit enter again and this idea
was added to our knowledge base you can
open this individual page or the entire
database let's click on view parent
and boom there is the idea we can
archive it again what makes boarding
really cool is that you can launch it
from pretty much any tab in your browser
and capture ideas without having to
switch tabs and look for the right place
where to enter information and then
finally the third automation I want to
show you uses the data scraper that
allows you to capture information from
different places on the web page such as
this LinkedIn profile to a destination
of your choice let's open birding from
here and I have the automation that will
copy a LinkedIn profile to a predefined
Google sheet in this case it's called
prospects I can click on view
and just like this the information was
saved now let's go back to LinkedIn and
I can click on the next person such as
artem over here
open up boarding click on this card
and then let's switch tabs to see the
information here we have artem's
information let's scroll a little bit
more to the right and you can see how
many fields were captured with just one
click if I had to copy paste all of this
information manually like I usually
would this would be excruciatingly
painful so scraper is the way to go let
me show you how this automation Works
let's open up boarding and then let's
open this Automation in the Builder so
as you can see you have the action that
captures information and then we have
the destination app which in this case
is a Google sheet the scraper action
over here has a required argument that's
called a scraper template a scraper
template informs bardeen what
information from a given web page that
you want to extract let's cancel the
input over here and let's build our very
own scraper template so I'm going to
click on create new scraper template and
pick the web page for which I want to
create template we have a single page
scraper and a list scraper a list
scraper scrapes a list of contacts for
example and a single page scraper so we
can give this scraper template a name
such as LinkedIn
LinkedIn demo start building and all you
need to do is visually show which Fields
you want to extract I want to grab
Martin's first name I can type first
name for example for this field
grab location
foreign
[Music]
and then it can also click on this image
over here and pick an image it's a
different data type you can click on
more and see some additional actions for
example this image has other attributes
looks like it's 200 by 200 it also has
an attribute that's called title so
let's click on get data and the last
piece of information that will be really
helpful for me is to get this profile
URL unfortunately I cannot click on it
because it's not in the body of the page
so I can click on ADD special field and
grab the page URL just like this and
here we have the URL saved as well I'm
going to save this scraper template so
here we have our special scraper
template and then if I click on this
Google Sheets action we already have a
specific spreadsheet linked up and then
we have the data coming from action
number one
click on done
and for the sake of the experiment I'm
going to delete all of the data from
here and see what happens when we run
our updated scraper template on this
page
okay let's go back to this profile
scroll to the left and here we have our
five fields that we just predefined over
here nicely organized boarding data
scraper is probably the most effective
way to get information saved from the
web to your central point of truth I
have a dedicated scraper tutorial that I
will link to in the post in the
paperless movement down below control
that is the part two this is where you
decide what to do with the captured
information and unfortunately this is
where in the world of software tools a
lot of problems begin information exists
where it was created for example where
do your events live in your Google
calendar they live there and they're
inaccessible to any other app and
frankly to yourself all you can do is
Click around so you don't really have
control over your data now with berdin
you can change all that check out this
automation is going to create a list of
all of my meetings within a given time
frame in Google Sheets so I'm going to
click on try it and here I need to
specify the start date in our date range
for example three months ago
that was June 27th until now
and then we're going to try to create a
new spreadsheet and call it my meetings
hit enter hit enter again
let's take a look at the spreadsheet
let's click on view
and here I have a long list of all of my
meetings created in just five seconds
boarding gives you the full control over
your apps you can grab information from
one place such as Google Calendar and
then add it to any other app it can be
airtable notion Asana you name it you
can export data you can transfer data
you can manipulate data it's up to you
output this is when you actually produce
something valuable you first create a
list group your tasks schedule them and
obviously execute and here's probably
why this is the status quo you can
either automate the workflows entirely
using tools like zapier or you'll be
forced to do them manually if there's a
tiny deviation from The Standard Process
here's an example of such workflow you
might want to create a Google meeting
attach a zoom link to it and send an
email reminder sounds simple in theory
but this is where tools like zapier are
going to fail because as they not have
contacts they don't have information
such as the title of the meeting when
the meeting is going to be who is going
to be with so you're stuck with opening
three tabs separately and copying
information from one place to another
and as you probably guessed it this is
where boarding comes in it allows you to
participate in the automations called
human in the loop types of automation
let's take a look at this specific one
create a Google calendar meeting with
zoom let's click on try it so when you
run this specific automation you are
asked for this argument such as when you
want the meeting to be for example 8 A.M
tomorrow
here we have the title
breakfast with Elon
let's do a quick 30 minute meeting
pick a participant
now we can run this automation let's
give it the name
and there we have our Google calendar
meeting with a zoom link let's take a
closer look at this Playbook to see how
you can create variable inputs and
automations
let's open up boarding let's open this
Automation in the Builder and here you
can see a few arguments they're called
ask me every time parameters this
parameter for the action create event
asks for the title of the event over
here so we have the title of the event
one who won the event to start the
duration of the event the participants
Etc so here if we want to have fixed
participants such as myself I'm going to
input my address
over here phenomenal but then we might
want to also have variable inputs
something that I will specify every time
I run the automation let's click on ask
me every time and then you can give this
variable a name it can be emails of
participants
under Advanced options over here this
can be a required field
or an optional field in my case I'll
make it optional so I'll untick this
field click on done
click on done again and see what else we
have in this automation we have create
the zoom meeting then grab the zoom
meeting link then we're going to add the
zoom meeting link to the description of
the event this is our automation I can
also add other actions let's click on
this plus icon add action
and pick Gmail and then find the action
that will send an email here we need to
specify the recipients and we can send
this email to the argument email of
participants this is the variable
argument that we've created earlier then
we have the email subject line
new meeting scheduled for example
you can copy yourself if you want to
that's what I'm going to do and here you
can add the body of the email it can be
the zoom meeting link it can be the
title of the event it's up to you how
you want to customize it let's recap you
no longer need to be stuck between doing
something entirely manually or automate
everything to run exactly the same way
you can participate in the automation to
run it the way you want it to run
finally part number four this is where
you refine your workflow you can either
optimize the process or you can automate
the process and frankly this is my
favorite part as an automation geek
remember that notification hello world
that we've created in the beginning of
the video Let's optimize and ultimate it
let's open it up in the Builder
and first let's try to optimize it it's
a notification it's meant to remind me
of something a browser notification
sounds good but most of the time I have
the focus mode on and instead I might
want a slack notification or I might
want an SMS reminder it's exactly what
I'm going to do so let's keep that
browser notification but let's add
another action and the action is going
to send me a text message
there we have it so we're going to
connect SMS notifications just like this
and add send text message action I'm
going to input my phone number
and the text message should say
something like meditate
I'm also going to go to the first action
instead of hello world
I'm going to say remember to meditate
change the title then let's go to
YouTube there's a meditation playlist
I'm going to copy the link
open boarding with the option b shortcut
paste the URL over here because why not
let's make it run automatically I'm
going to add a trigger it's going to be
a schedule trigger and we're going to
run this every day at 1pm this is when I
need to meditate the most the frequency
is going to be every day so by default
it's going to run out after one
occurrence I can specify how many times
I want to meditate and actually want to
meditate infinitely never stop click on
done click on done again
then finally when you create an
audiobook you need to enable it so make
sure to toggle this on and just like
this here's our refine process thank you
so much for tuning in this boarding Deep
dive special for the paperless movement
members okay guys I hope you like this
deep dive into Barbie as Reynard
mentioned you will find all the links in
the comments below if you like the video
give it a thumbs up and share with your
friends and if you haven't already
subscribe to this channel so I can catch
you up next time
