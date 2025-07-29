---
slug: "blog/sims-2-in-2025"
title: "Running Sims 2 in 2025"
description: ""
---
Recently I found myself in possession of Sims 2 Legacy Edition. I used to play Sims 2 when I was ~12 so it was fun to revisit. Legacy Edition (and the Sims franchise as a whole) has developed a reputation for buggy gameplay with savefiles that accumulate errors over time, so I thought it would be helpful to document my tinkering.

## General advice

After booting up the game for the first time, the graphics are set to lowest settings. I highly recommend setting them to highest values.

## Running on Linux

I do not currently have Windows on any machine, and running Sims 2 on Fedora through Wine worked perfectly with no config changes. Despite the relatively unusual combination of an old Nvidia graphics card + Wayland + a Wine-run game, graphics are working perfectly.

On the other hand, SimPE, a package editor / debugging tool people use for modding and cleaning up the savefile, took some headscratching. It would crash on load on Fedora, even though on a separate Arch machine it opened just fine. Updating Wine to 10.12 fixed the crash. I am using version 0.77.69.24.

Annoyingly, SimPE run through Wine has a slightly broken window theme, which results in white-on-white text in Preferences. 

### SimPE setup

As [various guides](https://srslysims.wixsite.com/srslysims/single-post/2016/07/12/Setup-SimPE-for-First-Time-Use) explain, SimPE first launches without any paths to your game installation, which you will need to provide. The guide I just linked to is for Ultimate Collection, so the paths are slightly different from Legacy Edition. [This forum thread](https://modthesims.info/showthread.php?t=690789) was helpful in explaining which paths exist for Legacy Edition.

To set up paths, open Extra > Preferences > System Folders. These are the valid paths for my installation:

| Directory                                 | Path                                               |
|-------------------------------------------|----------------------------------------------------|
| 1: Original                               | c:\Games\The Sims 2 Legacy Collection\Base\        |
| Save game                                 | c:\users\aci\Documents\EA Games\The Sims 2 Legacy\ |
| 1: University                             | c:\Games\The Sims 2 Legacy Collection\EP1\         |
| 2: Nightlife                              | c:\Games\The Sims 2 Legacy Collection\EP2\         |
| 3: Business                               | c:\Games\The Sims 2 Legacy Collection\EP3\         |
| 4: Pets                                   | c:\Games\The Sims 2 Legacy Collection\EP4\         |
| 5: Seasons                                | c:\Games\The Sims 2 Legacy Collection\EP5\         |
| 6: Bon Voyage                             | c:\Games\The Sims 2 Legacy Collection\EP6\         |
| 7: FreeTime                               | c:\Games\The Sims 2 Legacy Collection\EP7\         |
| 8: Apartments                             | c:\Games\The Sims 2 Legacy Collection\EP8\         |
| 9: Mansions and Garden Stuff              | c:\Games\The Sims 2 Legacy Collection\EP9\         |
| A: Angels and Nurses Stuff                |                                                    |
| 1: Family Fun Stuff                       | c:\Games\The Sims 2 Legacy Collection\SP1\         |
| 2: Glamour Stuff                          | c:\Games\The Sims 2 Legacy Collection\SP2\         |
| 3: Celebration! Stuff                     | c:\Games\The Sims 2 Legacy Collection\SP4\         |
| 4: HM Fashion Stuff                       | c:\Games\The Sims 2 Legacy Collection\SP5\         |
| 5: Teen Style Stuff                       | c:\Games\The Sims 2 Legacy Collection\SP6\         |
| 6: Store Edition                          |                                                    |
| 7: Kitchen and Bath Interior Design Stuff | c:\Games\The Sims 2 Legacy Collection\SP7\         |
| 8: IKEA Home Stuff                        | c:\Games\The Sims 2 Legacy Collection\SP8\         |
| 1: Life Stories                           |                                                    |
| 2: Pet Stories                            |                                                    |
| 3: Castaway Stories                       |                                                    |

Some paths (original and save game) seem to be stubborn, so you may want to restart SimPE for them to take effect.

Next, open Extra > Preferences > File Table. Select All and Reload. I think this loads game files into SimPE at appropriate paths. 

Next, open Extra > Preferences > System Checking. Run Check Info. All three rows should light up as green now. If they don't, you can probably click on underlines to see the reported error. This is how I learned about stubborn paths from earlier.

## Stuck on loading the family lot

After a few hours of playing I saved and reloaded the game, at which point I was unable to load the lot, as it was stuck in infinite loading. After checking out the [r/sims2help](https://old.reddit.com/r/sims2help/) subreddit and the [Fandom wiki](https://sims.fandom.com/), I:
* Loaded the neighbourhood as normal,
* Opened the console (Ctrl+Shift+C),
* Ran `testingCheatsEnabled true`,
* Attempted to load the family lot,
* The lot threw an error card, asking to ignore or delete an entity. (I believe the entity may have been a stuck dog.)
* I chose to delete, and the lot proceeded to load normally.

From here, testing cheats may be safely disabled, and playing can resume.

## Cooking / eating bug

Warning: thus far I've been **unable** to resolve this so far. The steps I've managed to go through could still be useful, however:

One time I instructed the sim to cook two foods at once, even though there was only one counter available. The sim put one meal in the oven, the other prep on the counter, then attempted to take the first meal out of the oven. As there was no counter available, the sim complained about the counter. The game handled the cooking problem poorly, by vanishing the meal object the Sim had nowhere to place, and making it impossible to finish cooking. The invisible token that says the Sim is cooking was still kept.

You have likely run into the same issue if you notice:
* Your Sim sometimes takes a food out of the oven and it vanishes.
* Your Sim sometimes sits down to eat a meal and teleports off the chair.
* Your oven door is stuck open.

At this point, you have two options:
* Exit the game without saving, assuming you haven't saved since your Sim started cooking.
* Fix your save through SimPE.

To fix the Sim tokens through SimPE:
* In SimPE, open Tools > Neighbourhood > Neighborhood Browser, and open the neighbourhood your sim is in.
* Open Tools > Neighbourhood > Sim Browser, and choose Open on your Sim.
* Open the Plugin View tab in the bottom panel, which should pull up *everything* to do with your Sim. (If you can't find the Plugin View, try toggling it twice in Window > Plugin View.)
* Open More > Sim Memories.

At this point I experienced the issue that in SimPE 0.77, all Sim Memories seem to be improperly read, resulting in attempted reading beyond end of stream. I installed SimPE 0.72, which *does* correctly read the memories of most sims... except mine, where it hangs. I don't have a solution right now, but I will keep thinking.
