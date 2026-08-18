# How to improve Sunsama's Calendar Design using Arc Boost

- **Video:** https://www.youtube.com/watch?v=TvUEJibCD7A
- **Ondertitel-taal:** en
- **Bron:** Firecrawl (YouTube-verwerker)

---

hey everyone those who are following us
at the paperless movement know that Paco
and I will love using Sans Sama as a
planner in combination with to doist and
click up if you want to learn more about
this check out the tool stack that we
use on our website watch one of the
other videos in this video I want to
look at a particular issue that I have
with Sama and how I solve this using Arc
The Arc browser on Mac and uh that's
also possible now on Windows if you're
using Arc The Arc browser is since we
switch to the arc browser there's no way
around it I'm using it daily I went so
far that all the productivity tools that
I use are in Arc I'm just using the basa
brows versions because I'm so much more
productive and having the native
versions and here we are in Arc
paperless movement your productivity
your way you see distraction free
there's no tabs on top like for Chrome
or anything like that this is Sans Sama
and Arc if I hit command s it gives me
the side panel and here you see all the
other things in Arc so you see I'm
actually in Arc so now being in here I
have an issue with Sama when it comes to
dark mode especially so here we have an
example where I moved the calendar items
to the task view as well and you see
here coming up the the times and when we
go to the calendar you see this as well
well and I have no idea why but they use
white color on top of these backgrounds
and for me it's really hard to see
obviously I could zoom in it makes it a
bit better but in general the contrast
would be so much higher if there is
black text so how do I solve this well
using Arc there are so many features
there are so many reasons to use ARC one
of the things is the Boost feature so
you see here if you go on the website on
this icon you have something called
boosts and here I can enable this and
now you see it becomes black obviously
this is not out of the box you have to
do it yourself but how easy it is to set
this up we will find out in this video
I'm just enabled the Boost now let's see
why this is going black okay I open this
up and here is a little window that
appears that lets you actually change
the whole website let's make the whole
website again and now I can change the
text see the whole text becomes
different I can make even crazy things
like this I can increase the contrast
with different colors the
brightness original saturation really to
your likings you see how I can mess all
these things up all capital letters for
example I can increase the size of the
site and you see it already looks like a
complete different
tool and that's fancy to do you can
activate dark mode on websites that have
no dark modes even see and I'm still in
Sama that's just to show you we have
also a sap so you can select items on
your page that you don't want to show so
let's say I don't want to show the
calendar on top here I can click there
and now I can say set related elements
you see on the right it pops up that
there is another thing that is related
to this element or even going a lot
further but now I want just to set this
boom it's gone the calendar as gun let's
take mode see now I have a really
customized Sama and you can do this with
all the other things I did it with
clickup and so many things however
usually I'm not going crazy with these
things okay so you can undo this
obviously you can reset all edits and
now it's back to
normal and I want to show you how to
make this white so how this works is
that you go to the code section here and
here you have the pick selector and now
you can pick any elements on this page
so I want in especially this element
here and if I select this I can copy
selector for this and now you are here
in CSS code but don't worry it's no not
complicated at all so now I pasted this
in
here and you see there's a lot of things
that that is there so ignore this just
hit enter and add these curly brackets
and now write down color whoops sorry
just color write down color and here you
can select already a color or you can
even add the hex color code so 0000
would be black but let's say black okay
boom now you see it became black
immediately but it just selected this
one item so the rest remained the same
so let's see how to fix this we can
remove all
this boom okay so there was a selector
and now I have the things that I really
want to make black now also for the
Times let's repeat the
process so calendar event time
date again
oops remove this
and do the same color
there boom black that's it so now when I
switch to dark
mode we really see the difference in my
opinion so let's make this small again
there we go here I can switch to dark
mode in the
settings and now it looks something like
that maybe you prefer prefer the white I
prefer this and that's how you fix this
now let's do the same for the task
because here in a dark mode so you see I
think it's even worse when we have it
here the green and the white it's really
hard to read but I want to see along
with the task that I have to do today on
this
day the meetings that I have and that's
usually the few that Paco and I focus on
every day to know what to work on and
then on a sequential order we can just
reorder
our task around these meetings so it's s
so much more convenient than moving
things around on a calendar and blocking
time out and things like that so I want
to see this much better the time that I
need to work here the time that I need
to be in the meeting
here so we do again we use the selector
picker we select this and now we copy
this and now let's see what happens you
see it takes a custom styling again and
the task title container you will see
this is not working so we just copy this
and make this and now you see boom
everything else gets black except this
because it picked the wrong container so
how to fix
this let's remove this again pick again
and now let's use this copy selector
from related and here you get an
indication what selector it's actually
picking so selector just means it's the
items here on your website what no
matter what website you are so let's go
through this and you see it's picking
more things the the more I move that are
related to each other and let's see to
find something with time okay so here we
are kban task start time indicator boom
let's select this put it in
here remove the
style so now we see it doesn't change
anything even that selected the right
selector here so if this happens you can
try and use exclamation mark
important and when you do this then it
should overwrite whatever is in the back
end so maybe there's in the back end
also something that says important don't
worry you're not hacking anything you're
not uh changing the website or anything
like that you're just changing the
visuals on your own browser locally
nothing is happening okay so this is not
distracting anything so now you see it
fixed
the the
times but not the times here so now this
is black as well so usually this is a
difference between active and inactive
state so let's
try and access this if you go to do
inactive you see it now changes the
color only of the inactive things or I
can then use
inactive and give it another
color and now you see when I do this I
see here is the time white and
here is the time black obviously if you
switch back now to light mode this might
get invisible as it is wide so you might
want to rather use a gray color and
that's it so now you see everything is
set up let's check out the difference we
open this up I can deactivate my Boost
anytime see everything is back to normal
and it's white now it's black and it's
much more readable at least for me and
the same is
here and that's it for this I think
these are the tiny things that are able
to change you don't need to have a
special tool if you're already using the
arc browser as many of us do nowadays
and I really like this instead of
reaching out now to the development
begging them to change the colors and I
don't know if it is only me but it is me
that who prefers it this way so I'm able
to quickly fix this even without uh a
lot of knowledge about coding or
anything like that so if you like the
video if you found it useful share with
your friends and if you haven't already
subscribe to the the channel so I can
catch you up next
[Music]
time it yeah
yeah paper L the name saving time is why
we came new type of workflow let's get
to it let's get to it
