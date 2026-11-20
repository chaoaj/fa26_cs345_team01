# Sprint 4 Plan


## Team and Sprint Information

| Field | Your answer |
| --- | --- |
| Team name | Team 1 |
| Team members | Amaya Cranford, Angelina Yoha, Yony Woube, Caden Cole VanValkenburg , Parker Giles, Parash Khanal|
| Project | Tower Defense Game |
| Sprint | Sprint 4 |
| Sprint start date | 2026-11-04 |
| Sprint end date (demo day) | 2026-12-04 |
| GitHub Projects link | https://github.com/users/chaoaj/projects/5/views/1 |

## 1. Sprint Goal

**Sprint Goal:**

We want to deliver the first playable core game loop by implementing enemy waves, troop attacks, collision logic, and loss conditions. By our demo day, a user should be able to select between visually distinct factions with unique troops and play through at least one complete wave.

### 1.1 Value to Stakeholders

Players/users benefit from this goal by being able to interact and actually play the game rather than a simple view/placement of troops. The stakeholder will receive a playable demo to show that each individual system works together to create the game.

### 2. GitHub Projects Setup Checklist

- [x] Created a new Sprint (iteration) named "Sprint 4" in GitHub Projects
- [x] Moved every Sprint Backlog Item into Sprint 4
- [x] Every Sprint Backlog Item has a story-point estimate
- [x] Every Sprint Backlog Item has acceptance criteria
- [ ] Every Sprint Backlog Item has tasks with hour estimates and assigned team members, listed in the item's comments
- [x] **Started the sprint:** set every Sprint Backlog Item to **In Progress**

## 3. Sprint Backlog Summary

| # | Sprint Backlog Item (user story) | Story points | GitHub issue |
| --- | --- | --- | --- |
| 1 | As a User, I want to fight the oncoming waves of enemies, so that the game can have an objective. | 3 | #13 |
| 2 | As a User, I want to be able to end the endless waves and win the game | 2 | #14 |
| 3 | As a User, I want my faction to have access to unique troops | 3 | #17 |
| 4 | As a User, I want my items on the map to actually collide, rather than gliding through each other | 3 | #19 |
| 5 | As a User, I want my troops to actually attack the enemies | 4 | #24 |
| 6 | As a User, I want custom designs for each faction so that I can distinguish between them | 4 | #27 |
| | **Total story points** | **19** | |

## 4. Work Distribution

| Team member | Tasks assigned (count) | Total hours |
| --- | --- | --- |
| Amaya Cranford | 4 | 4 hrs |
| Angelina Yoha | 2 | 3 hrs |
| Yony Woube | 5 | 5 hrs |
| Caden Cole VanValkenburg | 2 | 4 hrs |
| Parker Giles | 2 | 2 hrs |
| Parash Khanal | 2 | 2 hrs |
| **Team total** | **17** | **20 hrs** |

**Is the work split fairly?** Yes, the work is split fairly but not exactly evenly due to differing availabilities to work over Thanksgiving Break.

## ============================================================================

### Item 1: Enemy Waves

**User story:** As a User, I want to fight the oncoming waves of enemies, so that the game can have an objective.

**Story points:** 3

**GitHub issue:** #13

**Acceptance criteria:**

1. Waves start every so often (time period undecided)
2. Waves spawn around edges of map, and send their troops toward the player's base
3. Waves get harder over time
4. Sprites created for enemy variants

**Tasks:**

| Task | Estimate (hours) | Assigned to |
| --- | --- | --- |
| Spawn random waves of enemy squads around edge of map | 1 | Parker Giles |
| Make waves grow more difficulty over time | 1 | Parker Giles |
| Draw and implement pixel art for enemy squads | 1 | Amaya Cranford |
| **Total for this item** | **3** | |

### Item 2: End Option & Game Loss Condition

**User story:** As a User, I want to be able to end the endless waves and win the game

**Story points:** 2

**GitHub issue:** #14

**Acceptance criteria:**

1. After 5 waves player is offered the chance to end the game with a victory or continue
2. Ceneral Base has a health bar that when reach zero leads to game over screen with restart

**Tasks:**

| Task | Estimate (hours) | Assigned to |
| --- | --- | --- |
| Player is offered the chance to end the game early | 1 | Yony Woube |
| Centeral base health logic & game over conditon | 1 | Yony Woube |
| **Total for this item** | **2** | |

### Item 3: Create Faction Specific Troops and Squads

**User story:** As a User, I want my faction to have access to unique troops

**Story points:** 3

**GitHub issue:** #17

**Acceptance criteria:**

1. Each faction has a list of at least 3 unique squads it can deploy

**Tasks:**

| Task | Estimate (hours) | Assigned to |
| --- | --- | --- |
| Create squads/troops/weapons for Imperial faction | 1 | Parash Khanal |
| Create squads/troops/weapons for Spiritbound faction | .5 | Yony Woube |
| Create squads/troops/weapons for Spiritbound faction | 1 | Parash Khanal |
| **Total for this item** | **2.5** | |

### Item 4: Implement Collisions and Pathfinding

**User story:** As a User, I want my items on the map to actually collide, rather than gliding through each other

**Story points:** 3

**GitHub issue:** #19

**Acceptance criteria:**

1. Troops collide with each other and must go around one another (except in same squad)
2. Troops collide with map objects like trees and rocks
3. Projectiles collide with troops and map objects

**Tasks:**

| Task | Estimate (hours) | Assigned to |
| --- | --- | --- |
| Functions calculate if a Position object would collide with any nearby troops/map objects | 1 | Caden Cole VanValkenburg |
| Moving troops and projectiles calculate collisions | 3 | Caden Cole VanValkenburg |
| **Total for this item** | **4** | |

### Item 5: Implement Troop Targeting and Attacks

**User story:** As a User, I want my troops to actually attack the enemies

**Story points:** 4

**GitHub issue:** #24

**Acceptance criteria:**

1. Troops target enemy troops, prioritizing the squad they've been ordered to attack
2. Troops attack, reload, and attack again
3. Targeting follows weapon constraints like range and angle

**Tasks:**

| Task | Estimate (hours) | Assigned to |
| --- | --- | --- |
| Implement a troop getTarget(weapon) function | 1.5 | Angelina Yoha |
| Implement a troop checkTarget(weapon, target) function | 1.5 | Angelina Yoha |
| Implement a troop fireWeapon(weapon, target) function | 2 | Yony Woube |
| Cohesive tick(dt) function for troop calls and checks all functions | N/A | N/A |
| **Total for this item** | **N/A** | |

### Item 6: Faction and Screen Customization (Art)

**User story:** As a User, I want custom designs for each faction (troops/emblems) so that I can distinguish between them

**Story points:** 4

**GitHub issue:** #27

**Acceptance criteria:**

1. Start Screen/Faction Selection designed with the 3 different faction symbols
2. Sprites created for each troop variation
3. More weapons added
4. Respective weapons successfully attach to each troop

**Tasks:**

| Task | Estimate (hours) | Assigned to |
| --- | --- | --- |
| Draw background to use for all initial screens | 1 | Amaya Cranford |
| Draw and implement custom buttons/symbols | 1 | Amaya Cranford |
| Draw and implement troops for each faction | 1 | Amaya Cranford |
| Draw and implement new weapons | 1 | Yony Woube |
| **Total for this item** | **4** | |

