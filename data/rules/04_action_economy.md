# The Action Economy

Combat rounds represent approximately six seconds of simultaneous action. The old Standard/Quick/Free structure is retired. In its place: Action Points.

## Action Points

On your turn, you have **3 Action Points (AP)**. Every action costs **1 AP — no exceptions**. You do three things a turn, full stop. The AP economy governs *how many* things you do; Reserve and Momentum expenditure governs *how strong* those things are.

Every action belongs to one of five categories:

### Attacks (1 AP each)
- **Basic Attack:** roll 1 Attribute Die against the target's Defense Rating. No resource cost. See [Combat & Impact](05_combat.md).
- **Featured Attack:** an attack granted by a Talent. Costs 1 AP plus the Reserve and/or Momentum cost stated in its entry.

### Defends (1 AP each)
- **Guard** `(tunable)`: until the start of your next turn, Impact Rolls against you are Downgraded.
- Talents define further Defend actions.

### Maneuvers (1 AP each)
- **Move:** move up to your Base Speed (typically 30 feet). Difficult Terrain costs twice the normal movement, 2 feet of movement for every 1 foot traveled. You may take multiple Move actions on the same turn.
- **Stand:** rise from Prone.
- **Disengage:** until the end of your turn, your movement does not provoke Opportunity Attacks.

### Interactions (1 AP each)
- **Draw or stow a Readied item.** Retrieving a Stowed item takes two Interactions (2 AP total) `(tunable)` — see [Equipment](11_equipment.md).
- **Use an object:** open a door, pull a lever, drink a potion in hand.
- **Aid:** treat a Bleeding wound, extinguish a Burning ally, or similar stated 1-AP assistance.
- **Scrutinize:** actively examine something suspect, such as a suspected illusion.

### Spellcasting (1 AP each)
- **Cast a spell:** 1 AP plus the spell's Reserve cost by Tier. Spells tagged as Reactions or Free effects keep those tags and do not cost AP.
- **Drive a Channel:** maintain a Channeled spell. See [Spellcasting](09_spellcasting.md).

Some features grant **+1 AP** for a turn. Unless the feature deliberately says otherwise, that extra AP is restricted to non-Attack use.

## Reactions

Reactions are a separate resource outside the AP pool: one action held in reserve to respond to a specific trigger outside your turn. You have one Reaction per round, regained at the start of each of your turns. Opportunity Attacks, Free Hand techniques, and Shield Block all spend your Reaction — see [Combat & Impact](05_combat.md) and [Equipment](11_equipment.md).

## Free-Action Riders

Some effects trigger off something you are already doing — a strike that ignites on a hit, a surge of motion when an enemy falls. These riders sit entirely outside the AP economy. They cost **Momentum or Reserve points, never AP**, and they resolve as part of the action that triggered them. Speaking a sentence, dropping an item, or toggling a passive effect likewise costs nothing.

## Initiative

At the start of combat, every participant rolls their Agility Die. The highest result acts first, with remaining participants following in descending order. Some Talents or armor properties allow substituting a different Attribute Die for Initiative.

When two participants are tied, the one with the larger Agility Die acts first. A d8 beats a d6; a d10 beats a d8. If their Agility Dice are the same size, both participants reroll their Agility Dice, repeating until the tie is broken. This process repeats for every tied pair in the initiative order before play begins.

## Cover

[GAME NAME] recognizes two tiers of cover. Both require a solid object that obscures a meaningful portion of your form from your attacker. Cover bonuses apply to Vigor Defense and Agility Defense only; they have no effect against attacks targeting Focus Defense or Resolve Defense. Ignoring Cover bonuses does not bypass line of sight, however: an attack still requires a valid line of sight to its target, so a creature fully concealed with no line of sight cannot be targeted even by attacks against Focus or Resolve Defense.

- **Light Cover (+1 Vigor Defense / +1 Agility Defense):** An object obscures at least one-third of your form. Any enemy making an Impact Roll against you must Downgrade their Impact Die once.

- **Heavy Cover (+2 Vigor Defense / +2 Agility Defense):** An object obscures at least half of your form. Any enemy making an Impact Roll against you must Downgrade their entire Impact Pool. If you are fully concealed with no line of sight available, you cannot be targeted by single-target attacks.

## Opportunity Attacks

If you move out of an enemy's melee reach without deliberately disengaging, that enemy may use their Reaction to make a single melee attack against you before you leave their reach.
