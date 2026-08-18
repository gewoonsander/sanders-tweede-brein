# How to use Tana's AI Custom Prompts to fill custom fields like a Pro

- **Video:** https://www.youtube.com/watch?v=Frgc4c2LjlE
- **Ondertitel-taal:** en
- **Bron:** Firecrawl (YouTube-verwerker)

---

hello busy professional welcome back
today we will dive into Tana it is the
first video on this channel where we
talk about Tana but Paco our co-founder
and me we are heavily using Tana so it's
about time to dive deeper into how we
use it and there is one thing that I
want to talk is Tana Ai and how I can
leverage this in the database it's
actually very nice I will make it easy
to understand for you to start using it
in your own Tana right after the video
so let's dive in we have here the
example of a person's startup base and
you know if you tag a person with a
super tag you can create these person
tables if you want to see another video
about super tags let me know in a
comments below but now here we used
already a super tag and you get this
table and what T offers you you can just
click on this custom field and there you
can scroll down and see AI enhanced
field we activate this then we get an II
icon here so what happens when I click
this icon is it will find the first name
and it will paste it in here that's
something that Tana automatically
recognizes by just how you named the
colum and it actually works great the
only downside as you see already and you
might have seen on a thumbnail are these
hyphens that to me are just nonsense
it's because AI is taking this as a
string and well we don't dive into this
why but I want to dive into how to fix
this very quickly so let's delete all
these again so you see it filled it out
and I can delete it so in order to fix
this we go back to this AI enhanced
field and we go for custom prompt and
now I have a field here where I can
actually write my own AI prompt telling
the AI what it should do when you press
this button so let's open the prompt
workbench which gives you more
information if you never used this you
can read here but I found this very
confusing so that's why I make this
video to show you an easy solution how
to do this
so the first thing we want to enter here
is we want to tell it what this is all
about okay what should it do when I hit
this button so I will ask AI the
question what is the first name of and
the only thing you need to know is this
here okay so if you make a dollar sign
and you write into these curly brackets
this what it does it picks the name of
the node okay so Oscar Owen for example
here this is the name of the node so
this is what this stands for so no
matter what type of nodes you have it
will always look for the solution in
front of here then next we want to tell
it just return the first name as AI will
understand context it will understand
what you mean by first name so it
usually uses the first name in front of
it and then we give it an example to
better understand what we want so we
will say example and there we say input
put Tom solid for example and what we
expect as output is then Tom and then
you follow what it should do next so it
is going you know from top to bottom the
AI will read this from top to bottom and
then it will go here input and there you
enter again the dollar sign name it
looks so complicated but in fact all you
do is making a placeholder here for
whatever is in front of there okay so we
will use input let's close this so we
see it and if we click the AI button for
Oscar Owen it will look for the name on
front here so input Oscar Owen and
output we leave it empty because that's
what AI should do now so what you can do
you see on top there's Josh Miller the
CEO from Arc so you can use existing
noes to test the prompting that you did
here so when I just search for Oscar ow
and you can actually reference it in
here then it will use this and down
there you have a test AI completion and
there we go it works okay so I see Oscar
Owen it runs through this and it gives
me as the output Oscar so now let's see
if this works there's nothing else to do
no safe button or nothing it's already
in there now we press Ai and let's see
if the magic happens boom now filling in
all the things that we have there and
very interesting there's for example Dr
K and so you see it recognizes actually
first name it's not looking at the first
word on front something that you would
do for example in a Google sheet or
Excel sheet you could make formulas to
extract the first words no it's actually
recognizing that this is a title and
this is in the first name K that's
really amazing so I hope this was useful
this video if you liked it give it a
thumbs up and share with your friends if
you want to see more of Tana videos let
us know in the comments below subscribe
to Channel and I catch you guys up next
time
