# One orchestrator, many specialists. How my AI team runs my week.

- **Video:** https://www.youtube.com/watch?v=McPot5-N0ys
- **Ondertitel-taal:** nl (Lokale Whisper-transcriptie (large-v3), geen ondertitels beschikbaar)
- **Bron:** Lokale Whisper-transcriptie (large-v3)

---

In mijn laatste video heb ik met jullie de detailvolderstructuur van mijn AI-team geshared
en hoe het werkt en hoe je dit allemaal lokaal kan ontwikkelen.
Maar het lijkt me dat er nog steeds een ongelooflijkheid is
over wanneer ik heb gezegd dat ik twee verschillende AI-teamsystemen heb.
En in dit video zal ik je uitleggen waarom ik twee verschillende systemen gebruik
en waarom je dit ook zou moeten doen.
Laten we naar binnen gaan.
We hebben deze folderstructuur gekeken en het belangrijkste onderwerp van deze video
was hoe je een folderstructuur ontwikkelt om een orkestrator te hebben
en individuele team-specialisten die het werken doen.
En nu komt de ongelooflijkheid in, waarom ik het gebruik?
Ik heb een AI-team van verschillende verschillende agenten en je ziet hier nu de nieuwe pagina
die naar ons onderwerp komt waar je nu toegang kunt krijgen
naar de individuele agenten en ze downloaden en ze implementeren in je eigen setup.
Precies dezelfde agenten als ik ze op een dagelijks basis gebruik
met mijn AI-component.
En ze doen al het werk, ze bouwen een website, ze bouwen een onderwerp, al deze dingen.
Maar hoe zijn die niet geregistreerd?
Nou, ze zijn allemaal geregistreerd via Larry op de basis van Root, Claude, MD.
En om efficiënt te werken met deze agenten, moeten we deze basisfolderstructuur hebben
die ik je in de vorige video heb laten zien.
Deze folderstructuur biedt je de orkestrator Larry, die bewust is van het team,
wie er in het team zit, wat specialisten we hebben in het team.
We hebben ook Nolan, die de HR-persoon in het team is.
En dan hebben we Pax, die de onderzoeker in het team is.
Dus met deze drie agenten in plaats, kun je wat je wilt bouwen.
Laten we zeggen dat ik een agent nodig heb die specialiseerd is in het creëren van slide decks,
sociale media, beelden enzovoort.
Hier gebruik ik Charter, ze is een infografische ontwikkelaar.
Hier zijn alle details.
En als je deze zip-file downloadt, kun je dit gewoon aan Larry handelen, naar Claude, en het zal
perfect uitkomen in het team.
Hoe je dit zou doen op Autopilot voor iets specifieks dat je nodig hebt voor je business use case,
zou zijn dat je Larry vraagt om iets te doen waar hij geen expertise in heeft.
Hij zal de teamrooster bekeken.
Als er een specialist is, als er geen is, zal hij naar Nolan rekenen.
En Nolan zal dan naar Pax rekenen om de perfecte specialist online te zoeken,
omdat hij de onderzoeker is.
Hij komt terug met de opmerkingen en Nolan creëert deze nieuwe agent.
En zet het in het teamfolder.
Ik bedoel, dit ziet er fijn uit met de imago's hier.
Maar in het einde gebeurt het allemaal binnen deze folderstructuur.
En dan zullen ze deze nieuwe agent horen en het zal werken voor het team vanaf nu.
Dus nu wanneer ik een sociale media-image of een infografische vraag vraag naar Larry,
weet Larry dat er nu een specifieke agent is, Charter, die dit kan creëren.
En hij zal dit werk overgeven aan Charter, maar hij vervangt het in een manier waarop Charter
in de meest efficiënte manier kan werken.
Dit lijkt een beetje op fanciële dingen en gewoon dingen in een team te vormen,
maar onder de hoofd is dit eigenlijk hoogst efficiënt en zelfs tokensafspraak,
omdat Larry's claw.md-file slechts een paar lijnen is waar hij de informatie vindt
hoe het team kan accepteren.
Dus er is geen upfront token-loading van veel dingen.
En hij loodt dan alleen meer tokens in als hij het team bekeert.
En dan, als de agent het team bekeert, dan is het een hele mooie afspraak.
En als de agent begint te werken, dan begint deze agent te werken in de achtergrond met
zijn eigen context-window.
Dus dit betekent dat het Larry's context-window niet vervangt, en ik kan zelfs extra vragen vragen
in parallel vragen.
En dit is hoe ik werk met zes verschillende instansen van Larry in parallel.
Ze werken allemaal op verschillende dingen.
En hij is de Spock, de enige persoon van contact die ik nodig heb om contact te hebben met
wat ik nodig heb.
En hij zal er zeker voor zijn om te reageren en te orkestreren.
En hij zal de team nu reageren in een manier die de meeste zin maakt.
Dus bijvoorbeeld de complete overhoud die je misschien hebt gezien in onze onderneming,
de nieuwe redesigning enzovoort.
Dit was allemaal gedaan met een orkestrering tussen Iris.
Ze is de UI-designer en brandofficiënt.
En met Felix, de front-end ontwikkelaar.
En met Vera, ze is de Q&A-persoon.
Dit zijn de meeste drie agenten die verantwoordelijk zijn voor de complete overhoud van onze website
en de branding binnen de onderneming.
Zoals je kan zien nu.
En ik had net met Larry gesproken over de dingen die ik nodig heb, die we moeten streamlijnen
enzovoort.
Dus Larry had dit dan over naar Iris.
Ze is bewust van al het volgende design-langzaamheden, al die dingen.
Ze werkte dan direct met Felix, omdat hij de codebase en de front-end ontwikkelaar kent.
En dan, als ze deze dingen opsetten, is Vera de QA, de kwaliteitsverzekeraar, die dan
dubbelkijkt of de dingen in de onderneming goed zijn.
De dingen die ze implementeerden, werken goed, voordat ze terugkomen bij Larry.
En hij laat me weten dat het team het werk heeft gecompliceerd.
Ik kan het werk opnemen enzovoort.
En dit was prachtig, want ik heb deze sessie net overgegeven op mijn telefoon.
Ik ben buiten gegaan en was perfect klaar om te bezoeken of de vragen die op de weg kwamen
te realiseren.
Er was geen nodigheid voor mij om op de computer te zitten, terwijl ze het werk op onze
ondernemingsplatform waren aan het doen.
Dus.
Wat je hier ziet, en dit voorbeeld, gaat buiten de basis AI-team ontwikkeling.
De basis AI-team ontwikkeling betekent dat ze persistent herinneren dat je een sessie kan
sluiten en dat ze van deze sessie leren.
Ze doen dagelijks journalen en loggen, zodat ze over tijd echt met je groeien.
Ze hebben een taakmanagement, dus als er nog een taak is die nog open is, als je
dat sessie sluit, dan zal Larry ervoor zorgen dat hij dit opnoemt, zodat niets
afkomt.
En dan de houdingproces.
Dit is de basis en dat is waarom deze cursus die we nu aanwezig hebben, is de basis
cursus die je helpt om precies deze set-up te bouwen op de weg.
Wat we hier op de site nu hebben, is wat we nu het IPA-systeem noemen.
IPA betekent Intelligent Process Automation.
Dit is wanneer ik praat over Larry en het team dat voor mij in het bedrijf werkte en
echt werkte op mijn ICO.
Je weet Jack, hij is de community manager, hij heeft de kennis en de eerste niveau steun
en veel meer.
En dit hele team van 30 agenten die je ziet in deze video's die ik praat over en meer
komen hier ook naar deze AI-library die je dan kan downloaden en inpluggen.
Dit is het team dat voor mij in mijn ICO werkt.
Nu, je zou ook het andere video kunnen zien waar onze co-founder Paco Cantero zijn
PKA-systeem geshared heeft.
De persoonlijke kennis is een heel belangrijk onderwerp.
De persoonlijke kennis is een heel belangrijk onderwerp.
De persoonlijke kennis is een heel belangrijk onderwerp.
De persoonlijke kennis is een heel belangrijk onderwerp.
De persoonlijke kennis is een heel belangrijk onderwerp.
Dat is de persoonlijke kennis die het persoonlijke kennis beheert.
Vroeger was het PKM.
Dat was manueel gemaakt door ons.
Noten nemen, informatie maken, verbinden en al deze dingen.
En dit is compleet gegeven aan de AI.
En ik gebruik dit ook voor mijn persoonlijke kennis.
En dit is een ander systeem dat we ook hebben een oorzaak over die is genaamd persoonlijke
kennis steun.
Dus dit is ervoor zorgen dat je alleen het een en anderтерre
personal knowledge assistance, so this is ensuring that you can just hand in a screenshot
that this team will then make a daily journal entry and in my case it knows my invoices,
my contracts that I scanned in and it organizes it.
It has a CRM to track the people that I am connected with and whenever I hand in a daily
journal entry, it automatically connects all these different entities together.
My life goals, the people that I have, everything is backlinked as you would know it from using
something like Obsidian, Tana or Heptabase where you are able to do the back linking,
even Notion.
All this got killed just building the simple local folder structure with this team.
So if we zoom out, this means that we have now available three courses in the membership
that first cover this foundation that both of these systems share.
But they are for different purposes that you then can branch out.
So you can do the foundations course, you can go from there and build your own system
if you like.
You just need to tell Larry what you want to do and Nolan will hire whatever specialist
you need.
You don't need to download the agents even.
You can really build your own things or you then move into these two courses that will
give you additional folders and depending on complexity level, I like to have it separated.
The business operations.
From my personal knowledge management.
But you could even connect these together and have everything in one folder if you want
because they are interchangeable.
You can bring everything together.
And behind the scenes, this is how it looks in the membership.
You have these three courses and we call them workshop courses because they are literally
hands on lessons.
So if we go into any of these, you see here the progress of the course and you can go
into the lesson.
Let's go to beyond the starting lesson.
And in each lesson here.
You create a root folder.
You have a dedicated step by step guide how to set these things up including the prompts
that you can just copy and hand over to your class session.
You have a cheat sheet that shows you the current folders that you create.
You have a prompt sheet that gives you all the prompts of this lesson at hand that you
can very simply and copy this way.
You have a resources tab and this is the beautiful thing for each lesson.
The folders that we create during the lesson.
You can download this folder.
And they give you the work in progress folders that you're setting up.
This being said, you can obviously, if you don't care about how everything really works
and you want to skip ahead.
You can perfectly go just to the last lesson, which is the end of the foundations course
in this case and download this zip file.
Then you have to complete folder structure that you built during the course directly
available for you to use.
You have the deliverables, which is the inbox for the owner, including the archive.
You have the team in there.
With the example, agent already hired.
You have the team inbox.
You have the team knowledge in there.
You have SOPs that you create during the course for the team.
And all this is usable not only for Claude.
You can use Gemini or Codex also with this folder structure.
That makes it so beautiful because even that there is a .Claude folder, most of the information
lives in actual folders that are model independent.
So you can apply any model to this folder.
And it will start understanding.
And it will start understanding.
How this works.
So this would be the foundations folder structure that you get out of the first course and when
you then want to move on.
You can then move on to the next courses, which is this intelligent process automation
or the process knowledge assistance.
Here again, if you go in here and you go to the last lesson, you can download again the
zip file and then you can.
You're good to go.
But obviously we recommend as we put a lot of work into these different lessons to really
explain to you what this is all about.
How this works.
It's always better to understand what's going on.
And there we go.
See, I have instantly now this folder downloaded just from the course.
I have here now my life.
I have it set up by key elements.
These are all the ICO principles.
I have the PKM system.
Here's my daily journal set up already.
There's the team because you still have a team in here.
But here I have now a journal agent.
And now let's see what happens, how I can easily start using this.
So I show you that this is actually working.
So here's my folder now on desktop that I just downloaded from the course.
This gives me this folder structure.
And all I need to do is right click on this, services, new terminal at folder.
And here I just launched Claude Code as you usually would do.
We have now this terminal opened in this folder.
And now let's just ask who are you and what can you do.
And let's see what he does through the Claude MD file.
See, he perfectly, this is just downloaded from the course.
And he knows, he's Larry, he's the ITM orchestrator.
It's a single point of contact.
His job is to route the requests, what I can handle.
He knows that there's a journal entry.
And now I can just start journaling.
And now I will show you how easy it is to expand this.
So obviously you can ask Larry just to hire a health agent or anybody.
Be sure that I will also share the personal knowledge assistant agents here too.
And we will be able to sort by IPA.
And PKA agents.
But let's say I want to get this charter going to help me to create infographics.
I just can download this zip file here.
Which is again, just the folder structure of this agent with the content and the .md files in there.
So you see here, that's what is in there.
There's an installed .md.
There's context information.
And all I need to do, I can simply drag this folder into here.
And it picks up the folder name.
And I can say, hire.
This new agent.
And Larry will understand what he finds in here.
And there's onboarding questions that actually make this new agent specific to your specific needs.
You will see he will now start.
I route this to Nolan.
Hiring is his lane.
So he is now, Nolan knows now how to onboard this member.
Now Nolan is adding charter to the team.
He recognized the infographic designer.
Nolan has charter installed and registered.
She is in place.
Now I need to answer.
12 questions before charter will accept work on one.
To speed things up.
I will just say, decide for me.
So we can have a working agent right now.
But I highly recommend to go through these questions.
Because they ensure that this agent really is customized for your specific needs.
If we look here into team.
There we see charter already appeared.
Nolan already moved here.
If I open the agent index, you see charter is now part of the team.
And Larry, the next time we launch.
It will be aware that charter is now a team member.
So what charter actually needs to know is our design language.
You know, how should these social media images look like.
Or the slide deck that you want to create with her.
Or the infographics.
These are part of the questions.
But as you can see, there is also where should she deliver the things.
How should be the file formatting and so on.
And now we see here, she came up with a standard define.
With our standard branding design.
Which we actually could have set up by simply answering the questions.
There are still two options.
I just picked the low icon set.
But it could be also defaulting.
Doesn't matter if you don't know.
And now she is ready.
And now let's do something completely random.
That has nothing to do with my own life.
To see what we get out of it.
Create a social media graphic in square format.
About the increase of users using electric cars versus standard cars.
From 2022.
To 2026.
So you might have heard about Claude's design.
And all these fancy things.
But you will see that with this set up.
And this team in a local folder.
There is no need for OpenAI, JetGPT, image generator.
Because Charter is generating this just using HTML code.
So this is actually things that you can adjust very quickly.
It's not using any image tokens.
I have to quickly restart to make this work.
So here is a good moment.
To show you that I can now hit slash and say rename.
It will rename the session.
So you see there is now the session named.
I could have given it a custom name too.
I can now hit slash exit.
It exits the session.
I can set clear.
And we are on an empty slate.
I go back to Claude.
And I can hit slash resume.
And here are all the previous sessions that I was working in.
And here you see the session.
I can hit enter.
And I'm just back.
Where I left.
You see exit goodbye.
We restarted the thing.
And we can keep going.
And I can just bring what we just shared here.
And now I say create a social media infographic.
See, routing to Charter now.
That she is loaded.
That's the point.
So Larry is aware that there is Charter.
He is not doing the work.
It is actually Charter doing it.
He goes in here.
He pushes now the Claude.dmd file.
That is describing who Charter is and how she works.
And hands over this work.
To her.
And you see here now.
There is the agent Charter working.
It's even named by Charter.
So this is something that works so much better in the Claude code version here.
In my opinion.
Than using the desktop version.
But you will see even using Claude code in desktop works great with this.
Claude co-work is more restrictive when it comes to sending out different agents in parallel.
I don't know if they fix it in the meantime.
Or if this becomes even a thing.
But Claude code is the best way.
To use any orchestrating setups like we have here.
Now you see.
Charter is actually doing the web search.
I could now readjust and say.
Wait a minute.
Pax should actually do this research.
Not you.
And Larry will then reinforce this in the documentation.
That Charter is not allowed to do any research.
And this is how you can realign the people.
But maybe you want her to do this with her own perspective.
What she needs to search for.
And you send her out.
So that's totally up to you.
Now you see.
I'm mixing things up here.
As I'm here in my BKM system.
And not the IPA.
The big difference really is.
That in the IPA's.
I have work streams.
So while Charter is working.
I show you quickly my actual setup.
That I use to build in my iCore application.
To manage the community.
To create these videos.
And all this.
This is my folder structure.
And this is the IPA setup.
Where we have the BKM.
You see here.
There's already a lot in there.
There's SOPs.
Where the team knows how to do different things.
There are work streams.
Which are definitions on how to do what.
Work streams.
That's what we teach in iCore.
These are recurring projects.
So you can really define things.
With a consistent output.
That the team learns over time.
To do over and over again.
But in the PKA setup.
I want to grow.
Right.
My knowledge.
My insights.
My reflections.
Have serendipity about things.
And that's how I would use this.
And as I mentioned already.
You can merge these two folders into one.
If you want.
Depending on the complexity.
But if you for example have several businesses.
Or the complexity as I have with my iCore.
I want to have these things separate.
I don't want to mix things up.
My private personal insights.
Invoices.
Tax.
Accounting.
And so on.
What is just my own life.
Versus the business use case.
So in my opinion.
This is what I used as PKM in the past.
And this is literally the team.
At working for me.
That I hired.
Right.
So I didn't mix up human team members.
With my private diary either.
And that's exactly the same way.
How I see it here.
But I would be always able to point one.
At the folder of the other.
So I can extract information this way.
So we see now here.
She ended his work.
She delivered.
And we have here the deliverers folder.
Which is the inbox.
And there we go.
She created this folder.
Where now the content is in there.
And here we are.
This is the HTML file.
That I told you.
And this is an image.
PNG as you can see.
I open it up.
And there we go.
Electric is taking over.
Look at this beautiful image.
That she created.
And now I could you know say.
I want to have dark mode.
I want to have other colors.
I want to have a specific font style.
And so on.
But look at this outcome.
By just simply downloading this folder.
And downloading charter.
And plug her in.
And you get this out of the box.
Something that I put months and months into.
To refine.
Charter over and over.
To really get consistent output.
You get it now.
Just by joining my iCore.
And going to this AI library.
And plug any of these agents into your team.
And I highly recommend.
To go through these three courses.
That we built.
That really explain in great detail.
Why you build what you're building.
You know.
Create a PKM folder.
The key elements.
Why we use the my life concept.
Everything is linked back to our iCore methodology.
For example.
The my life concept.
Is part of the PKM like a pro course.
Where we explain.
How it works.
The current projects.
Key elements.
Topics.
And the team is working exactly against it.
So if you really want to dive deep.
And master your productivity system.
End to end.
Beyond AI.
Because as we keep saying.
AI is just a layer on top.
Of our productivity system.
That we've been teaching already.
For over four years now.
Here you get it all.
And everything is interconnected.
Well I hope this gave the insights needed.
To really understand.
How we approach AI.
And how we set up the systems.
And let me know in the comments below.
What agents are you using already?
Do you use a complete different setup?
I'm curious.
And if you want to see more.
Like for example.
Me comparing.
Using cloud opus 4.7.
On an empty folder.
Versus this team folder.
And compare the outputs.
Then make sure to subscribe to the channel.
So I can catch you up in the next one.
