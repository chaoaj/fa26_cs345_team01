// DEFINES SOME GENERIC FORMATIONS
const eightyManFormation = [
    // Sergeant — always first
    new Position(50, 0, 0),

    // Closest to center
    new Position(10, -10, 0),
    new Position(10, 10, 0),
    new Position(-10, -10, 0),
    new Position(-10, 10, 0),

    new Position(30, -10, 0),
    new Position(30, 10, 0),
    new Position(-30, -10, 0),
    new Position(-30, 10, 0),

    // Next
    new Position(10, -30, 0),
    new Position(10, 30, 0),
    new Position(-10, -30, 0),
    new Position(-10, 30, 0),

    new Position(30, -30, 0),
    new Position(30, 30, 0),
    new Position(-30, -30, 0),
    new Position(-30, 30, 0),

    // Next
    new Position(10, -50, 0),
    new Position(10, 50, 0),
    new Position(-10, -50, 0),
    new Position(-10, 50, 0),

    new Position(30, -50, 0),
    new Position(30, 50, 0),
    new Position(-30, -50, 0),
    new Position(-30, 50, 0),

    // Next
    new Position(10, -70, 0),
    new Position(10, 70, 0),
    new Position(-10, -70, 0),
    new Position(-10, 70, 0),

    new Position(30, -70, 0),
    new Position(30, 70, 0),
    new Position(-30, -70, 0),
    new Position(-30, 70, 0),

    // Next
    new Position(10, -90, 0),
    new Position(10, 90, 0),
    new Position(-10, -90, 0),
    new Position(-10, 90, 0),

    new Position(30, -90, 0),
    new Position(30, 90, 0),
    new Position(-30, -90, 0),
    new Position(-30, 90, 0),

    // Next
    new Position(10, -110, 0),
    new Position(10, 110, 0),
    new Position(-10, -110, 0),
    new Position(-10, 110, 0),

    new Position(30, -110, 0),
    new Position(30, 110, 0),
    new Position(-30, -110, 0),
    new Position(-30, 110, 0),

    // Next
    new Position(10, -130, 0),
    new Position(10, 130, 0),
    new Position(-10, -130, 0),
    new Position(-10, 130, 0),

    new Position(30, -130, 0),
    new Position(30, 130, 0),
    new Position(-30, -130, 0),
    new Position(-30, 130, 0),

    // Next
    new Position(10, -150, 0),
    new Position(10, 150, 0),
    new Position(-10, -150, 0),
    new Position(-10, 150, 0),

    new Position(30, -150, 0),
    new Position(30, 150, 0),
    new Position(-30, -150, 0),
    new Position(-30, 150, 0),

    // Next
    new Position(10, -170, 0),
    new Position(10, 170, 0),
    new Position(-10, -170, 0),
    new Position(-10, 170, 0),

    new Position(30, -170, 0),
    new Position(30, 170, 0),
    new Position(-30, -170, 0),
    new Position(-30, 170, 0),

    // Furthest from center
    new Position(10, -190, 0),
    new Position(10, 190, 0),
    new Position(-10, -190, 0),
    new Position(-10, 190, 0),

    new Position(30, -190, 0),
    new Position(30, 190, 0),
    new Position(-30, -190, 0),
    new Position(-30, 190, 0)
];
const eightyLineFirstFormation = [
    // Sergeant — center front
    new Position(50, 0, 0),

    // First Row
    new Position(30, -10, 0),
    new Position(30, -30, 0),
    new Position(30, -50, 0),
    new Position(30, -70, 0),
    new Position(30, -90, 0),
    new Position(30, -110, 0),
    new Position(30, -130, 0),
    new Position(30, -150, 0),
    new Position(30, -170, 0),
    new Position(30, -190, 0),
    new Position(30, 10, 0),
    new Position(30, 30, 0),
    new Position(30, 50, 0),
    new Position(30, 70, 0),
    new Position(30, 90, 0),
    new Position(30, 110, 0),
    new Position(30, 130, 0),
    new Position(30, 150, 0),
    new Position(30, 170, 0),
    new Position(30, 190, 0),

    // Second Row
    new Position(10, -10, 0),
    new Position(10, -30, 0),
    new Position(10, -50, 0),
    new Position(10, -70, 0),
    new Position(10, -90, 0),
    new Position(10, -110, 0),
    new Position(10, -130, 0),
    new Position(10, -150, 0),
    new Position(10, -170, 0),
    new Position(10, -190, 0),
    new Position(10, 10, 0),
    new Position(10, 30, 0),
    new Position(10, 50, 0),
    new Position(10, 70, 0),
    new Position(10, 90, 0),
    new Position(10, 110, 0),
    new Position(10, 130, 0),
    new Position(10, 150, 0),
    new Position(10, 170, 0),
    new Position(10, 190, 0),

    // Third Row
    new Position(-10, -10, 0),
    new Position(-10, -30, 0),
    new Position(-10, -50, 0),
    new Position(-10, -70, 0),
    new Position(-10, -90, 0),
    new Position(-10, -110, 0),
    new Position(-10, -130, 0),
    new Position(-10, -150, 0),
    new Position(-10, -170, 0),
    new Position(-10, -190, 0),
    new Position(-10, 10, 0),
    new Position(-10, 30, 0),
    new Position(-10, 50, 0),
    new Position(-10, 70, 0),
    new Position(-10, 90, 0),
    new Position(-10, 110, 0),
    new Position(-10, 130, 0),
    new Position(-10, 150, 0),
    new Position(-10, 170, 0),
    new Position(-10, 190, 0),

    // Fourth Row
    new Position(-30, -10, 0),
    new Position(-30, -30, 0),
    new Position(-30, -50, 0),
    new Position(-30, -70, 0),
    new Position(-30, -90, 0),
    new Position(-30, -110, 0),
    new Position(-30, -130, 0),
    new Position(-30, -150, 0),
    new Position(-30, -170, 0),
    new Position(-30, -190, 0),
    new Position(-30, 10, 0),
    new Position(-30, 30, 0),
    new Position(-30, 50, 0),
    new Position(-30, 70, 0),
    new Position(-30, 90, 0),
    new Position(-30, 110, 0),
    new Position(-30, 130, 0),
    new Position(-30, 150, 0),
    new Position(-30, 170, 0),
    new Position(-30, 190, 0)
];
const tenManFormation = [
    // Sergeant — center front
    new Position(30, 0, 0),

    // Second row
    new Position(15, -15, 0),
    new Position(15, 15, 0),

    // Third row
    new Position(0, -22.5, 0),
    new Position(0, 0, 0),
    new Position(0, 22.5, 0),

    // Fourth row
    new Position(-15, -22.5, 0),
    new Position(-15, 0, 0),
    new Position(-15, 22.5, 0),

    // Rear row
    new Position(-30, -15, 0),
    new Position(-30, 15, 0)
];
const wedgeFormation = [
    // Row 1 — 1
    new Position(90, 0, 0),

    // Row 2 — 2
    new Position(60, 15, 0),
    new Position(60, -15, 0),

    // Row 3 — 3
    new Position(30, 0, 0),
    new Position(30, 30, 0),
    new Position(30, -30, 0),

    // Row 4 — 4
    new Position(0, 15, 0),
    new Position(0, -15, 0),
    new Position(0, 45, 0),
    new Position(0, -45, 0),

    // Row 5 — 5
    new Position(-30, 0, 0),
    new Position(-30, 30, 0),
    new Position(-30, -30, 0),
    new Position(-30, 60, 0),
    new Position(-30, -60, 0),

    // Row 6 — 6
    new Position(-60, 15, 0),
    new Position(-60, -15, 0),
    new Position(-60, 45, 0),
    new Position(-60, -45, 0),
    new Position(-60, 75, 0),
    new Position(-60, -75, 0),

    // Row 7 — 7
    new Position(-90, 0, 0),
    new Position(-90, 30, 0),
    new Position(-90, -30, 0),
    new Position(-90, 60, 0),
    new Position(-90, -60, 0),
    new Position(-90, 90, 0),
    new Position(-90, -90, 0),

    // Row 8 — 2
    new Position(-120, 15, 0),
    new Position(-120, -15, 0)
];

const squadProsCons = {
    // Pros
    regen: {
        text: "Regeneration",
        tooltip: "Squad members regain health over time"
    },
    high_health: {
        text: "High Health",
        tooltip: "Squad has higher than average health"
    },
    very_health: {
        text: "Very High Health",
        tooltip: "Squad has very high health"
    },
    poison: {
        text: "Poisoned Weapons",
        tooltip: "Attacks inflict a damage over time effect, dealing 1 point of damage per second for 5 seconds"
    },
    fast: {
        text: "Fast",
        tooltip: "Squad is quick to move and turn"
    },
    armor: {
        text: "High Armor",
        tooltip: "Squad has higher than average armor"
    },
    dual_wield: {
        text: "Dual Wielding",
        tooltip: "Troops wield two different weapons"
    },
    flying: {
        text: "Flying",
        tooltip: "Flying soldiers cannot be targeted by melee attacks from non-flying soldiers, and do not collide with non-flying soldiers and terrain"
    },
    ap: {
        text: "Armor-Piercing",
        tooltip: "Attacks ignore most armor"
    },
    large_area: {
        text: "Large Area Attacks",
        tooltip: "Attacks hit all enemies in a large area"
    },
    massive_area: {
        text: "Massive Area Attacks",
        tooltip: "Attacks hit all enemies in a massive area"
    },
    lifesteal: {
        text: "Lifesteal",
        tooltip: "Attacks heal the attacker by a percentage of the damage dealt"
    },
    piercing: {
        text: "Piercing Projectiles",
        tooltip: "Projectiles continue after hitting an enemy"
    },
    hybrid: {
        text: "Hybrid Unit",
        tooltip: "Members of the squad are capable of both melee and ranged attacks"
    },
    dmg: {
        text: "High Damage",
        tooltip: "Squad deals above average damage"
    },
    reach: {
        text: "Long Reach",
        tooltip: "Melee attacks have a long range"
    },
    range: {
        text: "Long Range",
        tooltip: "Ranged attacks have a long range"
    },
    heals: {
        text: "Heals Allies",
        tooltip: "This squad can heal allies"
    },
    area: {
        text: "Damaging Aura",
        tooltip: "Members of this squad damage enemies around them over time"
    },
    rapid_reload: {
        text: "Rapid Reload",
        tooltip: "Ranged weapons have a short reload time"
    },
    flamethrower: {
        text: "Flamethrower",
        tooltip: "Ranged attacks hit all enemies in front of the target over time"
    },
    shield: {
        text: "Shielded",
        tooltip: "Troops in the squad have a shield that regenerates over time, and must be depleted before the troop takes damage"
    },
    homing: {
        text: "Homing Projectiles",
        tooltip: "Projectiles fired by this unit home in on their targets, and can acquire new targets if the target dies"
    },
    multi_turret: {
        text: "Multi-turreted",
        tooltip: "This unit has turrets surrounding it, allowing for 360 degree fire"
    },
    broadside: {
        text: "Broadside",
        tooltip: "This unit has the majority of its firepower pointing to the sides"
    },
    // Cons
    slow: {
        text: "Slow",
        tooltip: "Squad is slow to move and turn"
    },
    very_slow: {
        text: "Very Slow",
        tooltip: "Squad is very slow to move and turn"
    },
    low_dmg: {
        text: "Low Damage",
        tooltip: "Squad deals below average damage"
    },
    low_accuracy: {
        text: "Low Accuracy",
        tooltip: "Ranged attacks by members of this squad have a low accuracy"
    },
    low_health: {
        text: "Low Health",
        tooltip: "Squad has lower than average health"
    },
    low_armor: {
        text: "Low Armor",
        tooltip: "Squad has lower than average armor"
    },
    unarmored: {
        text: "Unarmored",
        tooltip: "Squad has no armor"
    },
    low_count: {
        text: "Low Unit Count",
        tooltip: "Squad has few members"
    },
    low_range: {
        text: "Short Range",
        tooltip: "Ranged attacks have a short range"
    },
    single_entity: {
        text: "Single Entity",
        tooltip: "Squad contains a single troop"
    },
    cant_attack_move: {
        text: "Can't Attack While Moving",
        tooltip: "Squad cannot make attacks while moving"
    },
}

// DEFINES ALL PROJECTILES/WEAPONS/TROOPS/SQUADS
const definitions = {
    // Projectiles
    projectiles: {
        arrow: {
            name: "Arrow",
            type: ProjectileType.BULLET,
            visual: ARROW_VISUAL,
            speed: 200,
            r: 1,
            dmg: 2,
            ap: 0
        },
        poison_arrow: {
            name: "Poisoned Arrow",
            type: ProjectileType.BULLET,
            visual: ARROW_VISUAL,
            speed: 200,
            r: 1,
            dmg: 0.5,
            ap: 0
        },
        lead_bullet: {
            name: "Bullet",
            type: ProjectileType.BULLET,
            visual: BULLET_VISUAL,
            speed: 300,
            r: 0.5,
            dmg: 3,
            ap: 5
        },
        fireball: {
            name: "Fireball",
            type: ProjectileType.AREA,
            visual: FIREBALL_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaAngle: Math.PI / 8,
            areaRange: 50,
            speed: 400,
            dmg: 5,
            ap: 0,
            r: 3
        },
        catapult_stone: {
            name: "Catapult Stone",
            type: ProjectileType.AREA,
            visual: CATAPULT_STONE_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaAngle: Math.PI / 8,
            areaRange: 40,
            speed: 400,
            dmg: 10,
            ap: 5,
            r: 7.5
        },
        blood_droplet: {
            name: "Blood Droplet",
            type: ProjectileType.PIERCE,
            visual: BLOOD_DROP_VISUAL,
            speed: 150,
            dmg: 2,
            ap: 5,
            r: 1
        },
        bullet: {
            name: "Bullet",
            type: ProjectileType.BULLET,
            visual: BULLET_VISUAL,
            speed: 400,
            r: 0.5,
            dmg: 1,
            ap: 5
        },
        railgun_slug: {
            name: "Railgun Slug",
            type: ProjectileType.PIERCE,
            visual: SLUG_VISUAL,
            speed: 800,
            r: 5,
            dmg: 40,
            ap: 10,
        },
        autocannon_round: {
            name: "Autocannon Round",
            type: ProjectileType.PIERCE,
            visual: AUTOCANNON_SHELL_VISUAL,
            speed: 600,
            r: 1.5,
            dmg: 10,
            ap: 6,
        },
        missile: {
            name: "Missile",
            type: ProjectileType.MISSILE,
            visual: MISSILE_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            turnRate: 2 * Math.PI / 3,
            areaRange: 40,
            speed: 300,
            dmg: 5,
            ap: 3,
            r: 2.5
        },
        nuclear_missile: {
            name: "Nuclear Missile",
            type: ProjectileType.MISSILE,
            visual: MISSILE_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaRange: 40,
            speed: 300,
            dmg: 50,
            ap: 8,
            r: 2.5
        },
        swarm_missile: {
            name: "Swarm Missile",
            type: ProjectileType.MISSILE,
            visual: MISSILE_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaRange: 20,
            speed: 300,
            dmg: 50,
            ap: 8,
            r: 2.5
        },
        low_swarm_missile: {
            name: "Swarm Missile",
            type: ProjectileType.MISSILE,
            visual: MISSILE_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaRange: 80,
            turnRate: 2 * Math.PI / 3,
            speed: 300,
            dmg: 5,
            ap: 2,
            r: 2.5
        },
        grenade: {
            name: "Grenade",
            type: ProjectileType.AREA,
            visual: GRENADE_VISUAL,
            speed: 100,
            area: true,
            areaType: AreaType.CIRCLE,
            areaRange: 25,
            ap: 3,
            dmg: 10,
            r: 2.5
        },
        grenade_launched: {
            name: "Grenade",
            type: ProjectileType.AREA,
            visual: GRENADE_VISUAL,
            speed: 200,
            area: true,
            areaType: AreaType.CIRCLE,
            areaRange: 25,
            ap: 3,
            dmg: 10,
            r: 2.5
        },
        heavy_shell: {
            name: "Heavy Shell",
            type: ProjectileType.AREA,
            visual: HEAVY_SHELL_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaAngle: Math.PI / 8,
            areaRange: 80,
            speed: 600,
            dmg: 25,
            ap: 6,
            r: 3
        },
        naval_shell: {
            name: "Naval Shell",
            type: ProjectileType.AREA,
            visual: HEAVY_SHELL_VISUAL,
            area: true,
            areaType: AreaType.CIRCLE,
            areaAngle: Math.PI / 8,
            areaRange: 100,
            speed: 200,
            dmg: 100,
            ap: 20,
            r: 3
        }
    },
    weapons: {
        // Melee
        bite: {
            name: "Bite",
            type: WeaponType.MELEE,
            visual: NO_VISUAL,
            range: [0, 8, 8],
            reload: 2,
            fireWhileMoving: true,
            dmg: 1,
            ap: 0,
            areaType: MeleeType.THRUST,
            areaRange: 8,
            areaAngle: Math.PI / 24,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return LaserVisual(
                    x,
                    y,
                    tx,
                    ty,
                    2,
                    0.1,
                    [0, 50, 0, 100]
                )
            }
        },
        fist: {
            name: "Fist",
            type: WeaponType.MELEE,
            visual: NO_VISUAL,
            range: [0, 5, 5],
            reload: 4,
            fireWhileMoving: true,
            dmg: 1,
            ap: 0,
            areaType: MeleeType.THRUST,
            areaRange: 5,
            areaAngle: Math.PI / 24,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return LaserVisual(
                    x,
                    y,
                    tx,
                    ty,
                    2,
                    0.1,
                    [50, 50, 50, 100]
                )
            }
        },
        dagger: {
            name: "Dagger",
            type: WeaponType.MELEE,
            visual: DAGGER_VISUAL,
            range: [0, 12, 15],
            reload: 1,
            fireWhileMoving: true,
            dmg: 2,
            ap: 0,
            areaType: MeleeType.THRUST,
            areaRange: 15,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return LaserVisual(
                    x,
                    y,
                    tx,
                    ty,
                    1,
                    0.1,
                    [200, 200, 200, 150]
                )
            }
        },
        sword: {
            name: "Sword",
            type: WeaponType.MELEE,
            visual: SWORD_VISUAL,
            range: [0, 20, 20],
            reload: 1,
            dmg: 4,
            ap: 1,
            areaType: MeleeType.SWING,
            areaRange: 20,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, a) => {
                return TemporaryConeVisual(
                    20,
                    Math.PI / 2,
                    x,
                    y,
                    a,
                    0.25,
                    [200, 200, 200, 150]
                )
            }
        },
        greatsword: {
            name: "Greatsword",
            type: WeaponType.MELEE,
            visual: GREATSWORD_VISUAL,
            range: [0, 40, 45],
            reload: 1,
            dmg: 4,
            ap: 2,
            areaType: MeleeType.SWING,
            areaRange: 45,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, a) => {
                return TemporaryConeVisual(
                    45,
                    Math.PI / 2,
                    x,
                    y,
                    a,
                    0.25,
                    [200, 200, 200, 150]
                )
            }
        },
        vampire_sword: {
            name: "Vampire's Sword",
            type: WeaponType.MELEE,
            visual: GREATSWORD_VISUAL,
            range: [0, 40, 45],
            reload: 1,
            dmg: 4,
            ap: 2,
            areaType: MeleeType.SWING,
            areaRange: 45,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            lifeSteal: 0.25,
            atkVisual: (x, y, a) => {
                return TemporaryConeVisual(
                    45,
                    Math.PI / 2,
                    x,
                    y,
                    a,
                    0.25,
                    [200, 200, 200, 150]
                )
            }
        },
        angelic_sword: {
            name: "Angelic Sword",
            type: WeaponType.MELEE,
            visual: ANGELIC_SWORD_VISUAL,
            range: [0, 50, 60],
            reload: 5,
            dmg: 50,
            ap: 10,
            areaType: MeleeType.THRUST,
            areaRange: 60,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                const visual = new TemporaryVisual(function () {
                    strokeWeight(0);
                    fill(200, 200, 200, 255 * this.transparency);
                    const dx = this.tx - this.x;
                    const dy = this.ty - this.y;
                    const len = Math.hypot(dx, dy);
                    if (len === 0) return;
                    const ux = dx / len;
                    const uy = dy / len;
                    const px = -uy;
                    const py = ux;
                    const bx = this.x + ux * 5;
                    const by = this.y + uy * 5;
                    const bulge = 0.75 * len / 60;
                    const smallBulge = bulge / 3
                    triangle(bx + px * bulge, by + py * bulge, bx - px * bulge, by - py * bulge, tx, ty);
                    fill(160, 160, 160, 255 * this.transparency);
                    triangle(bx + px * smallBulge, by + py * smallBulge, bx - px * smallBulge, by - py * smallBulge, lerp(x, tx, 0.6), lerp(y, ty, 0.6));
                }, 255, 0.5);
                visual.x = x;
                visual.y = y;
                visual.tx = tx;
                visual.ty = ty;
                return visual;
            }
        },
        cleansing_aura: {
            name: "Cleansing Aura",
            type: WeaponType.AREA,
            visual: NO_VISUAL,

            constant: true,
            ap: 2,
            dmg: 4,
            areaType: AreaType.CIRCLE,
            areaRange: 75,
            areaAngle: 2 * Math.PI,
            range: [0, 80, 5000],
            reload: 0,
            fireWhileMoving: true,
            atkVisual: (x, y) => {
                return TemporaryCircleVisual(150, 150, x, y, 1, [255, 255, 255, 20])
            }
        },
        healing_aura: {
            name: "Healing Aura",
            type: WeaponType.AREA,
            visual: NO_VISUAL,

            constant: true,
            dmg: -2,
            targetsAllies: true,
            areaType: AreaType.CIRCLE,
            areaRange: 75,
            areaAngle: 2 * Math.PI,
            range: [0, 80, 5000],
            reload: 0,
            fireWhileMoving: true,
            atkVisual: (x, y) => {
                return TemporaryCircleVisual(150, 150, x, y, 1, [255, 255, 255, 20])
            }
        },
        troll_great_axe: {
            name: "Great Axe",
            type: WeaponType.MELEE,
            visual: TROLL_AXE,
            range: [0, 40, 45],
            reload: 1,
            dmg: 4,
            ap: 2,
            areaType: MeleeType.SWING,
            areaRange: 45,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, a) => {
                return TemporaryConeVisual(
                    45,
                    Math.PI / 2,
                    x,
                    y,
                    a,
                    0.25,
                    [200, 200, 200, 150]
                )
            }
        },
        giant_club: {
            name: "Giant's Club",
            type: WeaponType.MELEE,
            visual: GIANT_CLUB_VISUAL,
            range: [0, 200, 200],
            reload: 5,
            dmg: 100,
            ap: 15,
            areaType: MeleeType.THRUST,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return TemporaryCircleVisual(80, 80, tx, ty, 0.25, [100, 100, 100, 200])
            }
        },
        giant_stomp: {
            name: "Stomp",
            type: WeaponType.MELEE,
            areaType: MeleeType.SWING,
            areaAngle: 2 * Math.PI,
            areaRange: 120,
            visual: NO_VISUAL,

            reload: 4,
            ap: 5,
            dmg: 10,
            range: [0, 120, 120],
            fireWhileMoving: true,
            atkVisual: (x, y, a) => {
                return TemporaryCircleVisual(240, 240, x, y, 0.5, [115, 64, 28, 200])
            }
        },
        scythe: {
            name: "Scythe",
            type: WeaponType.MELEE,
            visual: SCYTHE_VISUAL,
            range: [0, 18, 20],
            reload: 2,
            fireWhileMoving: true,
            dmg: 10,
            ap: 4,
            areaType: MeleeType.SWING,
            areaRange: 18,
            areaAngle: 2 * Math.PI / 3,
            fireWhileMoving: true,
            atkVisual: (x, y, a) => {
                return TemporaryConeVisual(
                    18,
                    2 * Math.PI / 3,
                    x,
                    y,
                    a,
                    0.25,
                    [0, 0, 0, 100]
                )
            }
        },
        spear: {
            name: "Spear",
            type: WeaponType.MELEE,
            visual: SPEAR_VISUAL,
            range: [0, 30, 30],
            reload: 1,
            fireWhileMoving: true,
            dmg: 2,
            ap: 0,
            areaType: MeleeType.THRUST,
            areaRange: 30,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return LaserVisual(
                    x,
                    y,
                    tx,
                    ty,
                    2,
                    0.1,
                    [200, 200, 200, 150]
                )
            }
        },
        pike: {
            name: "Pike",
            type: WeaponType.MELEE,
            visual: PIKE_VISUAL,
            range: [90, 100, 100],
            reload: 1,
            dmg: 3,
            ap: 0,
            areaType: MeleeType.THRUST,
            areaRange: 100,
            areaAngle: Math.PI / 2,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return LaserVisual(
                    x,
                    y,
                    tx,
                    ty,
                    1,
                    0.1,
                    [200, 200, 200, 150]
                )
            }
        },
        lance: {
            name: "Lance",
            type: WeaponType.MELEE,
            visual: LANCE_VISUAL,
            range: [0, 50, 50],
            reload: 4,
            fireWhileMoving: true,
            dmg: 10,
            ap: 2,
            areaType: MeleeType.THRUST,
            areaRange: 50,
            areaAngle: Math.PI / 16,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                return LaserVisual(
                    x,
                    y,
                    tx,
                    ty,
                    2,
                    0.1,
                    [200, 200, 200, 150]
                )
            }
        },
        bayonet: {
            name: "Bayonet",
            type: WeaponType.MELEE,
            visual: BAYONET_VISUAL,

            dmg: 5,
            ap: 1,
            areaType: MeleeType.THRUST,
            areaRange: 15,
            areaAngle: 30
        },
        // Ranged
        bloody_chalice: {
            name: "Bloody Chalice",
            type: WeaponType.PROJECTILE,
            visual: BLOOD_GOBLET_VISUAL,
            shotCount: 20,

            lifeSteal: 0.1,
            projectile: "blood_droplet",
            range: [5, 200, 200],
            burst: 1,
            reload: 2,
            dmg: 2,
            accuracy: 5,
            fireWhileMoving: true
        },
        arrow_tower: {
            name: "Archer Tower",
            type: WeaponType.PROJECTILE,
            visual: ARROW_TOWER_VISUAL,

            projectile: "arrow",
            range: [5, 700, 800],
            burst: 1,
            burstSpeed: 0.5,
            reload: 0.5,
            dmg: 2,
            accuracy: 75
        },
        recurve_bow: {
            name: "Recurve Bow",
            type: WeaponType.PROJECTILE,
            visual: BOW_VISUAL,

            projectile: "arrow",
            range: [5, 700, 800],
            burst: 1,
            reload: 5,
            dmg: 2,
            accuracy: 80
        },
        skeleton_bow: {
            name: "Recurve Bow",
            type: WeaponType.PROJECTILE,
            visual: BOW_VISUAL,

            statusEffects: [StatusType.POISON],
            projectile: "poison_arrow",
            range: [5, 700, 800],
            burst: 1,
            reload: 5,
            accuracy: 80
        },
        horse_bow: {
            name: "Horse Bow",
            type: WeaponType.PROJECTILE,
            visual: BOW_VISUAL,

            projectile: "arrow",
            range: [5, 400, 500],
            burst: 1,
            reload: 4,
            dmg: 2,
            accuracy: 50,
            fireWhileMoving: true
        },
        arquebus: {
            name: "Arquebus",
            type: WeaponType.PROJECTILE,
            visual: ARQUEBUS_VISUAL,

            projectile: "lead_bullet",
            range: [10, 900, 1000],
            burst: 1,
            reload: 8,
            dmg: 1,
            accuracy: 85,
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1);
                    splineVertex(6, 0);
                    splineVertex(1, -1);
                    endShape(CLOSE);
                    fill(200, 200, 200, smokeTransparency);
                    ellipse(6, 0, 12, 4);

                    pop();
                }, 255, 0.5);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = 3 * visual.maxTime / 4;
                return visual;
            }
        },
        flintlock_pistol: {
            name: "Flintlock Pistol",
            type: WeaponType.PROJECTILE,
            visual: FLINTLOCK_VISUAL,

            projectile: "lead_bullet",
            range: [10, 800, 800],
            burst: 1,
            reload: 5,
            dmg: 1,
            accuracy: 70,
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1);
                    splineVertex(6, 0);
                    splineVertex(1, -1);
                    endShape(CLOSE);
                    fill(200, 200, 200, smokeTransparency);
                    ellipse(6, 0, 12, 4);

                    pop();
                }, 255, 0.5);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = 3 * visual.maxTime / 4;
                return visual;
            }
        },
        catapult: {
            name: "Catapult",
            type: WeaponType.PROJECTILE,
            visual: NO_VISUAL,

            projectile: "catapult_stone",
            burst: 1,
            reload: 15,
            burstSpeed: 1,
            accuracy: 70,
            range: [50, 1500, 1500]
        },
        lightning_spell: {
            name: "Lightning",
            type: WeaponType.AREA,
            visual: NO_VISUAL,

            constant: true,
            ap: 8,
            dmg: 5,
            areaType: AreaType.LINE,
            areaRange: 1000,
            areaAngle: Math.PI / 10,
            range: [0, 900, 1000],
            reload: 0.5,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                const visual = new TemporaryVisual(function () {
                    strokeWeight(1);
                    noFill();
                    // We'll run three lines and then
                    const dx = this.tx - this.x;
                    const dy = this.ty - this.y;
                    const len = Math.hypot(dx, dy);

                    // Perpendicular unit vector
                    const px = -dy / len;
                    const py = dx / len;
                    const variance = len / 50;
                    for (let j = -1; j < 2; j++) {
                        stroke(j == -1 ? STOCK_COLORS.LIGHTNING3 : j == -2 ? STOCK_COLORS.LIGHTNING2 : STOCK_COLORS.LIGHTNING1);
                        beginShape();
                        vertex(this.x, this.y);
                        // 3 points along the line
                        for (let i = 1; i <= 3; i++) {
                            const t = (i + (j / 2)) / 4;

                            // Base position along line
                            const bx = this.x + dx * t;
                            const by = this.y + dy * t;

                            // Random perpendicular displacement
                            const offset = Math.random() * variance * 2 - variance;

                            vertex(
                                bx + px * offset,
                                by + py * offset
                            );
                        }
                        vertex(this.tx, this.ty);
                        endShape();
                    }
                }, 255, 1.5);
                visual.x = x;
                visual.y = y;
                visual.tx = tx;
                visual.ty = ty;
                return visual;
            }
        },
        healing_spell: {
            name: "Healing",
            type: WeaponType.AREA,
            visual: STAFF_VISUAL,

            constant: true,
            targetsAllies: true,
            dmg: -2,
            areaType: AreaType.LINE,
            areaRange: 250,
            areaAngle: Math.PI / 10,
            range: [0, 200, 250],
            reload: 0.5,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => { return ConstantLaserVisual(x, y, tx, ty, 0.5, 1, STOCK_COLORS.WHITE) }
        },
        fireball_spell: {
            name: "Fireball",
            type: WeaponType.PROJECTILE,
            visual: NO_VISUAL,

            projectile: "fireball",
            burst: 1,
            reload: 5,
            burstSpeed: 1,
            fireWhileMoving: true,
            accuracy: 80,
            range: [50, 900, 1000]
        },
        holy_smite: {
            name: "Holy Smite",
            type: WeaponType.AREA,
            visual: NO_VISUAL,

            reload: 5,
            dmg: 20,
            ap: 20,

            areaType: AreaType.LINE,
            areaRange: 100,
            areaAngle: Math.PI / 12,
            range: [8, 100, 100],
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => {
                const visual = new TemporaryVisual(function () {
                    strokeWeight(0);
                    fill(255, 255, 255, 255 * this.transparency);
                    const dx = this.tx - this.x;
                    const dy = this.ty - this.y;
                    const len = Math.hypot(dx, dy);

                    if (len === 0) return;

                    const ux = dx / len;
                    const uy = dy / len;

                    // Perpendicular unit vector
                    const px = -uy;
                    const py = ux;

                    // Bulge extends 5 units forward
                    const bx = this.x + ux * 5;
                    const by = this.y + uy * 5;

                    beginShape();
                    vertex(this.x, this.y);
                    splineVertex(this.x, this.y);
                    splineVertex(bx + px * 3, by + py * 3);
                    splineVertex(this.tx, this.ty);
                    vertex(this.tx, this.ty);
                    splineVertex(this.tx, this.ty);
                    splineVertex(bx - px * 3, by - py * 3);
                    splineVertex(this.x, this.y);
                    endShape(CLOSE);
                }, 255, 1);
                visual.x = x;
                visual.y = y;
                visual.tx = tx;
                visual.ty = ty;
                return visual;
            }
        },
        thrown_grenade: {
            name: "Grenade",
            type: WeaponType.PROJECTILE,
            visual: NO_VISUAL,
            projectile: "grenade",
            range: [10, 50, 50],
            reload: 10,
            accuracy: 80,
            fireWhileMoving: true
        },
        grenade_launcher: {
            name: "Grenade Launcher",
            type: WeaponType.PROJECTILE,
            visual: RIFLE_VISUAL,

            projectile: "grenade_launched",
            range: [20, 150, 250],
            accuracy: 90,
            reload: 3
        },
        burst_rifle: {
            name: "Burst Rifle",
            type: WeaponType.PROJECTILE,
            visual: RIFLE_VISUAL,

            projectile: "bullet",
            range: [20, 700, 800],
            burst: 3,
            burstSpeed: 0.05,
            reload: 1.5,
            dmg: 3,
            accuracy: 90,
            fireWhileMoving: true
        },
        large_railgun: {
            name: "Large Railgun",
            type: WeaponType.PROJECTILE,
            visual: RAILGUN_VISUAL,

            projectile: "railgun_slug",
            range: [5, 1500, 2000],
            burst: 1,
            reload: 10,
            accuracy: 100,
            fireWhileMoving: true
        },
        autocannon: {
            name: "Autocannon",
            type: WeaponType.PROJECTILE,
            visual: AUTOCANNON_VISUAL,

            projectile: "autocannon_round",
            range: [5, 800, 1500],
            burst: 1,
            reload: 1,
            accuracy: 95,
            fireWhileMoving: true,
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(2, 2);
                    splineVertex(12, 0);
                    splineVertex(2, -2);
                    endShape(CLOSE);
                    fill(200, 200, 200, smokeTransparency);
                    ellipse(12, 0, 24, 8);

                    pop();
                }, 255, 0.5);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = 3 * visual.maxTime / 4;
                return visual;
            }
        },
        laser_gun: {
            name: "Lasgun",
            type: WeaponType.LASER,
            visual: RIFLE_VISUAL,
            range: [20, 700, 800],
            burst: 3,
            burstSpeed: 0.2,
            reload: 2,
            dmg: 2,
            ap: 5,
            accuracy: 90,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => { return LaserVisual(x, y, tx, ty, 1, 0.125) }
        },
        base_defender: {
            name: "Base Defender",
            type: WeaponType.LASER,
            visual: DEFENDER_VISUAL,

            projectile: "laser",
            range: [0, 800, 1000],
            reload: 2,
            dmg: 4,
            ap: 3,
            accuracy: 80,
            atkVisual: (x, y, tx, ty) => { return LaserVisual(x, y, tx, ty, 1.5, 0.3) }
        },
        particle_lance: {
            name: "Particle Lance",
            type: WeaponType.LASER,
            visual: PARTICLE_LANCE_VISUAL,

            projectile: "laser",
            range: [5, 500, 600],
            reload: 1,
            burst: 2,
            burstSpeed: 0.25,
            dmg: 10,
            ap: 10,
            accuracy: 100,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => { return LaserVisual(x, y, tx, ty, 2, 0.25, [255, 255, 255, 255]) }
        },
        laser_pistol: {
            name: "Laser Pistol",
            type: WeaponType.LASER,
            visual: PISTOL_VISUAL,

            projectile: "laser",
            range: [0, 300, 500],
            reload: 0.25,
            dmg: 2,
            ap: 2,
            fireWhileMoving: true,
            accuracy: 60,
            atkVisual: (x, y, tx, ty) => { return LaserVisual(x, y, tx, ty, 1, 0.125) }
        },
        heavy_laser: {
            name: "Heavy Laser",
            type: WeaponType.AREA,
            visual: MACHINE_GUN_VISUAL,

            constant: true,
            ap: 1,
            dmg: 5,
            areaType: AreaType.LINE,
            areaRange: 1000,
            areaAngle: Math.PI / 10,
            range: [0, 900, 1000],
            reload: 0.5,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => { return ConstantLaserVisual(x, y, tx, ty, 1.5, 1) }
        },
        ships_laser: {
            name: "Concentrated Laser",
            type: WeaponType.AREA,
            visual: MACHINE_GUN_VISUAL,

            constant: true,
            ap: 50,
            dmg: 10,
            areaType: AreaType.LINE,
            areaRange: 1000,
            areaAngle: Math.PI / 10,
            range: [0, 900, 1000],
            reload: 0.5,
            fireWhileMoving: true,
            atkVisual: (x, y, tx, ty) => { return ConstantLaserVisual(x, y, tx, ty, 1.5, 1) }
        },
        laser_turret: {
            name: "Laser Turret",
            type: WeaponType.LASER,
            visual: MACHINE_GUN_VISUAL,

            projectile: "laser",
            range: [5, 1000, 1000],
            reload: 1,
            dmg: 6,
            ap: 3,
            fireWhileMoving: true,
            accuracy: 95,
            atkVisual: (x, y, tx, ty) => { return LaserVisual(x, y, tx, ty, 1.5, 0.2) }
        },
        flamethrower: {
            name: "Flamethrower",
            type: WeaponType.AREA,
            visual: FLAMETHROWER_VISUAL,

            constant: true,
            ap: 1,
            dmg: 5,
            areaType: AreaType.CONE,
            areaRange: 100,
            areaAngle: Math.PI / 10,
            range: [0, 100, 100],
            reload: 1,
            fireWhileMoving: true,
            atkVisual: (x, y, a) => {
                return TemporaryConeVisual(
                    100,
                    Math.PI / 10,
                    x,
                    y,
                    a,
                    1,
                    STOCK_COLORS.FLAME2
                )
            }
        },
        energy_shield: {
            name: "Energy Shield",
            type: WeaponType.AREA,
            visual: NO_VISUAL,

            constant: true,
            ap: 0,
            dmg: 2,
            areaType: AreaType.CIRCLE,
            areaRange: 10,
            areaAngle: 2 * Math.PI,
            range: [0, 10, 5000],
            reload: 0,
            fireWhileMoving: true,
            atkVisual: (x, y) => {
                return TemporaryCircleVisual(20, 20, x, y, 1, STOCK_COLORS.ENERGY)
            }
        },
        citadel_exhaust: {
            name: "Weaponized Exhaust",
            type: WeaponType.AREA,
            visual: NO_VISUAL,

            constant: true,
            ap: 2,
            dmg: 4,
            areaType: AreaType.CIRCLE,
            areaRange: 90,
            areaAngle: 2 * Math.PI,
            range: [0, 90, 5000],
            reload: 0,
            fireWhileMoving: true,
            atkVisual: (x, y) => {
                return TemporaryCircleOutlineVisual(180, 180, x, y, 60, 1, [226, 88, 34, 50])
            }
        },
        nuclear_missile_launcher: {
            name: "Nuclear Missile Launcher",
            type: WeaponType.PROJECTILE,
            visual: MISSILE_LAUNCHER,

            projectile: "nuclear_missile",
            burst: 3,
            burstSpeed: 0.5,
            reload: 20,
            fireWhileMoving: true,
            range: [20, 2000, 2000]
        },
        swarm_missile_launcher: {
            name: "Swarm Missile Launcher",
            type: WeaponType.PROJECTILE,
            visual: MISSILE_LAUNCHER,

            projectile: "swarm_missile",
            burst: 1,
            shotCount: 10,
            reload: 20,
            accuracy: 10,
            fireWhileMoving: true,
            range: [20, 1500, 1500]
        },
        low_swarm_missile_launcher: {
            name: "Swarm Missile Launcher",
            type: WeaponType.PROJECTILE,
            visual: MISSILE_LAUNCHER,

            projectile: "low_swarm_missile",
            burst: 3,
            burstSpeed: 0.5,
            reload: 15,
            fireWhileMoving: true,
            range: [20, 2000, 2000]
        },
        left_missile_launcher: {
            name: "Missile Launcher",
            type: WeaponType.PROJECTILE,
            visual: MISSILE_LAUNCHER_LEFT,

            projectile: "missile",
            burst: 3,
            burstSpeed: 0.5,
            reload: 20,
            dmg: 20,
            accuracy: 100,
            fireWhileMoving: true,
            range: [20, 700, 1200]
        },
        right_missile_launcher: {
            name: "Missile Launcher",
            type: WeaponType.PROJECTILE,
            visual: MISSILE_LAUNCHER_RIGHT,

            projectile: "missile",
            burst: 3,
            burstSpeed: 0.5,
            reload: 20,
            dmg: 20,
            accuracy: 100,
            fireWhileMoving: true,
            range: [20, 700, 1200]
        },
        missile_launcher: {
            name: "Missile Launcher",
            type: WeaponType.PROJECTILE,
            visual: MISSILE_LAUNCHER,

            projectile: "missile",
            burst: 3,
            burstSpeed: 0.5,
            reload: 20,
            dmg: 20,
            accuracy: 100,
            fireWhileMoving: true,
            range: [20, 700, 1200]
        },
        heavy_cannon: {
            name: "Heavy Cannon",
            type: WeaponType.PROJECTILE,
            visual: HEAVY_CANNON_VISUAL,

            projectile: "heavy_shell",
            burst: 1,
            reload: 8,
            burstSpeed: 1,
            fireWhileMoving: true,
            accuracy: 90,
            range: [50, 1000, 1500],
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, -2);
                    splineVertex(4, 2);
                    splineVertex(24, -2);
                    splineVertex(4, -6);
                    endShape(CLOSE);
                    fill(200, 200, 200, smokeTransparency);
                    ellipse(24, -2, 48, 16);

                    pop();
                }, 255, 0.5);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = 3 * visual.maxTime / 4;
                return visual;
            }
        },
        naval_cannon: {
            name: "Naval Cannon",
            type: WeaponType.PROJECTILE,
            visual: RAILGUN_VISUAL,

            projectile: "naval_shell",
            burst: 1,
            reload: 15,
            burstSpeed: 1,
            fireWhileMoving: true,
            accuracy: 90,
            range: [10, 1000, 1000]
        },
        howitzer_cannon: {
            name: "Howitzer Cannon",
            type: WeaponType.PROJECTILE,
            visual: ART_CANNON_VISUAL,

            projectile: "heavy_shell",
            burst: 1,
            reload: 7,
            burstSpeed: 1,
            fireWhileMoving: true,
            accuracy: 100,
            range: [50, 4000, 4000],
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, -2);
                    splineVertex(4, 2);
                    splineVertex(24, -2);
                    splineVertex(4, -6);
                    endShape(CLOSE);
                    fill(200, 200, 200, smokeTransparency);
                    ellipse(24, -2, 48, 16);

                    pop();
                }, 255, 0.5);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = 3 * visual.maxTime / 4;
                return visual;
            }
        },
        short_machine_gun: {
            name: "Machine Gun",
            type: WeaponType.PROJECTILE,
            visual: SHORT_MACHINE_GUN_VISUAL,

            projectile: "bullet",
            burst: 5,
            burstSpeed: 0.05,
            reload: 0.05,
            accuracy: 60,
            fireWhileMoving: true,
            range: [25, 600, 700],
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 206, 0, smokeTransparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1.5);
                    splineVertex(8, 0);
                    splineVertex(1, -1.5);
                    endShape(CLOSE);

                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1);
                    splineVertex(6, 0);
                    splineVertex(1, -1);
                    endShape(CLOSE);

                    pop();
                }, 255, 0.05);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = visual.maxTime / 2;
                return visual;
            }
        },
        machine_gun: {
            name: "Machine Gun",
            type: WeaponType.PROJECTILE,
            visual: MACHINE_GUN_VISUAL,

            projectile: "bullet",
            burst: 5,
            burstSpeed: 0.05,
            reload: 0.05,
            accuracy: 60,
            fireWhileMoving: true,
            range: [25, 600, 700],
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 206, 0, smokeTransparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1.5);
                    splineVertex(8, 0);
                    splineVertex(1, -1.5);
                    endShape(CLOSE);

                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1);
                    splineVertex(6, 0);
                    splineVertex(1, -1);
                    endShape(CLOSE);

                    pop();
                }, 255, 0.05);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = visual.maxTime / 2;
                return visual;
            }
        },
        tank_machine_gun: {
            name: "Machine Gun",
            type: WeaponType.PROJECTILE,
            visual: TANK_MG_VISUAL,

            projectile: "bullet",
            burst: 5,
            burstSpeed: 0.05,
            reload: 0.05,
            accuracy: 60,
            fireWhileMoving: true,
            range: [25, 600, 700],
            fireVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    strokeWeight(0);
                    const smokeTransparency = 255 * (this.time > this.invert ? (this.maxTime - this.time) / this.invert : this.time / this.invert);
                    fill(255, 206, 0, smokeTransparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1.5);
                    splineVertex(8, 0);
                    splineVertex(1, -1.5);
                    endShape(CLOSE);

                    fill(255, 154, 0, 255 * this.transparency);
                    beginShape();
                    splineVertex(0, 0);
                    splineVertex(1, 1);
                    splineVertex(6, 0);
                    splineVertex(1, -1);
                    endShape(CLOSE);

                    pop();
                }, 255, 0.05);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.invert = visual.maxTime / 2;
                return visual;
            }
        }
    },
    troops: {
        battleship: {
            name: "Battleship",
            visual: [ BATTLESHIP_VISUAL ],
            health: 5000,
            armor: 20,
            size: 200,
            sizeY: 60,
            speed: 50,
            turnRate: Math.PI / 8,
            broadside: true,
            weapons: [
                {
                    weapon: "nuclear_missile_launcher",
                    x: -165,
                    y: -60,
                    px: 16,
                    py: 0,
                    angle: -Math.PI,
                    turnRange: [-Math.PI / 2, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "nuclear_missile_launcher",
                    x: -165,
                    y: 60,
                    px: 16,
                    py: 0,
                    angle: Math.PI,
                    turnRange: [-Math.PI / 2, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "machine_gun",
                    x: 190,
                    y: -20,
                    px: 16,
                    py: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                },
                {
                    weapon: "machine_gun",
                    x: -45,
                    y: -58,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 2, 0],
                    under: true
                },
                {
                    weapon: "machine_gun",
                    x: 190,
                    y: 20,
                    px: 16,
                    py: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                },
                {
                    weapon: "machine_gun",
                    x: -45,
                    y: 58,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [0, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 20,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 40,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 60,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 80,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 100,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 120,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 140,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 160,
                    y: 15,
                    px: 40,
                    py: 2,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 20,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 40,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 60,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 80,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 100,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 120,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 140,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                },
                {
                    weapon: "naval_cannon",
                    x: 160,
                    y: -15,
                    px: 40,
                    py: 2,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 64, Math.PI / 64],
                    under: true
                }
            ]
        },

        destroyer: {
            name: "Destroyer",
            visual: [ DESTROYER_VISUAL ],
            health: 2000,
            armor: 20,
            size: 100,
            sizeY: 60,
            speed: 100,
            turnRate: Math.PI / 4,
            weapons: [
                {
                    weapon: "ships_laser",
                    x: -78.75,
                    y: 73.75,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 36, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -76.25,
                    y: 61.25,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 36, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -73.75,
                    y: 48.75,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 36, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -71.25,
                    y: 36.25,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 36, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -78.75,
                    y: -73.75,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 36],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -76.25,
                    y: -61.25,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 36],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -73.75,
                    y: -48.75,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 36],
                    under: true
                },
                {
                    weapon: "ships_laser",
                    x: -71.25,
                    y: -36.25,
                    px: 16,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 36],
                    under: true
                },
                {
                    weapon: "swarm_missile_launcher",
                    x: -75,
                    y: -76,
                    px: 16,
                    py: 0,
                    angle: -Math.PI / 2,
                    turnRange: [0, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "swarm_missile_launcher",
                    x: -75,
                    y: 76,
                    px: 16,
                    py: 0,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 2, 0],
                    under: true
                }
            ]
        },
        // MONSTERS
        spider: {
            name: "Giant Spider",
            visual: [ SPIDER_VISUAL ],

            health: 12,
            armor: 0,
            size: 8,
            sizeY: 9,
            speed: 60,
            turnRate: 2 * Math.PI,

            weapons: [
                {
                    weapon: "bite",
                    x: 7,
                    y: 0,
                    px: 1,
                    py: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                }
            ]
        },

        giant: {
            name: "Giant",
            visual: [ GIANT_VISUAL ],

            health: 3000,
            armor: 0,
            size: 40,
            sizeY: 80,
            speed: 80,
            turnRate: Math.PI / 6,
            regen: 4,
            moveVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    translate(this.x, this.y);
                    rotate(this.a);
                    const cycle = this.timeElapsed % (this.cycle * 2);
                    const half = cycle >= this.cycle ? 1 : -1;
                    const alpha = (this.cycle - (cycle % this.cycle)) / this.cycle;
                    strokeWeight(0);
                    fill(115, 64, 28, 150 * alpha);
                    ellipse(0, half * 40, 80, 80);
                    pop();
                }, 255, 0.75);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.cycle = 0.75;
                return visual;
            },

            weapons: [
                {
                    weapon: "giant_club",
                    x: 0,
                    y: 75,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                },
                {
                    weapon: "giant_stomp",
                    x: 0,
                    y: 0,
                    px: 0,
                    py: 0,
                    turnRange:[-Math.PI, Math.PI],
                    under: true
                }
            ]
        },

        troll: {
            name: "Swamp Troll",
            visual: [ TROLL_VISUAL, TROLL_1_VISUAL, TROLL_2_VISUAL, TROLL_3_VISUAL, TROLL_4_VISUAL, TROLL_5_VISUAL ],

            health: 150,
            armor: 0,
            size: 10,
            sizeY: 15,
            speed: 50,
            turnRate: Math.PI / 2,
            regen: 5,

            weapons: [
                {
                    weapon: "troll_great_axe",
                    x: 0,
                    y: 12,
                    px: 5,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },
        // GROUND
        zombie: {
            name: "Zombie",
            visual: [ ZOMBIE_VISUAL ],

            health: 25,
            armor: 0,
            size: 4.5,
            sizeY: 7.5,
            speed: 20,
            turnRate: Math.PI / 6,
            regen: 0.5,

            weapons: [
                {
                    weapon: "fist",
                    x: 0,
                    y: 7.5,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                },
                {
                    weapon: "fist",
                    x: 0,
                    y: -7.5,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                }
            ]
        },

        skeleton_spearman: {
            name: "Spearman",
            visual: [ SKELETON_VISUAL ],

            health: 15,
            armor: 1,
            size: 3,
            sizeY: 6,
            speed: 30,
            turnRate: Math.PI / 4,
            regen: 0.25,

            weapons: [
                {
                    weapon: "spear",
                    x: 0,
                    y: 6,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        skeleton_archer: {
            name: "Archer",
            visual: [ SKELETON_VISUAL ],

            health: 10,
            armor: 1,
            size: 3,
            sizeY: 6,
            speed: 30,
            turnRate: Math.PI / 4,
            regen: 0.25,

            weapons: [
                {
                    weapon: "skeleton_bow",
                    x: 7,
                    y: 0,
                    px: 4,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        spirit: {
            name: "Restless Spirit",
            visual: [ SPIRIT_VISUAL, SPIRIT_1_VISUAL, SPIRIT_2_VISUAL, SPIRIT_3_VISUAL, SPIRIT_4_VISUAL, SPIRIT_5_VISUAL ],

            health: 8,
            armor: 8,
            size: 5,
            sizeY: 5,
            speed: 70,
            turnRate: Math.PI,
            regen: 0.5,

            moveVisual: SPECTRAL_MOVE_VISUAL,
            weapons: [
                {
                    weapon: "dagger",
                    x: 0,
                    y: -6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "dagger",
                    x: 0,
                    y: 6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                }
            ]
        },

        reaper: {
            name: "Reaper",
            visual: [ REAPER_VISUAL, REAPER_1_VISUAL, REAPER_2_VISUAL, REAPER_3_VISUAL, REAPER_4_VISUAL, REAPER_5_VISUAL ],

            health: 30,
            armor: 8,
            size: 5,
            sizeY: 5,
            speed: 100,
            turnRate: Math.PI,
            regen: 2,
            flying: true,

            moveVisual: REAPER_MOVE_VISUAL,
            weapons: [
                {
                    weapon: "scythe",
                    x: 10,
                    y: 0,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                }
            ]
        },

        soldier: {
            name: "Soldier",
            visual: [ MAN_VISUAL ],

            health: 10,
            armor: 1,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "laser_gun",
                    x: 0,
                    y: 6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        base_defender: {
            name: "Soldier",
            visual: [ SHIELDED_SOLDIER_VISUAL ],

            health: 10,
            armor: 1,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "laser_gun",
                    x: 0,
                    y: 6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        spearman: {
            name: "Spearman",
            visual: [ SHIELDED_4_VISUAL, SHIELDED_VISUAL, SHIELDED_1_VISUAL, SHIELDED_2_VISUAL, SHIELDED_3_VISUAL, SHIELDED_5_VISUAL ],

            health: 10,
            armor: 1,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI / 3,

            weapons: [
                {
                    weapon: "spear",
                    x: 0,
                    y: 6.5,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        tercio_officer: {
            name: "Tercio Officer",
            visual: [ ARMORED_1_VISUAL, ARMORED_VISUAL, ARMORED_2_VISUAL, ARMORED_3_VISUAL, ARMORED_4_VISUAL, ARMORED_5_VISUAL ],

            health: 20,
            armor: 2,
            size: 4.5,
            sizeY: 7.5,
            speed: 35,
            turnRate: Math.PI / 8,

            weapons: [
                {
                    weapon: "flintlock_pistol",
                    x: 2.5,
                    y: -7,
                    px: 8,
                    py: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "pike",
                    x: 0,
                    y: 6.5,
                    px: 100,
                    py: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                }
            ]
        },

        pikeman: {
            name: "Pikeman",
            visual: [ ARMORED_11_VISUAL, ARMORED_1_VISUAL, ARMORED_2_VISUAL, ARMORED_3_VISUAL, ARMORED_4_VISUAL, ARMORED_5_VISUAL, ARMORED_6_VISUAL, ARMORED_7_VISUAL, ARMORED_8_VISUAL, ARMORED_9_VISUAL, ARMORED_10_VISUAL, ARMORED_VISUAL ],

            health: 10,
            armor: 1,
            size: 4.5,
            sizeY: 7.5,
            speed: 35,
            turnRate: Math.PI / 8,

            weapons: [
                {
                    weapon: "dagger",
                    x: 0,
                    y: -6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "pike",
                    x: 0,
                    y: 6.5,
                    px: 100,
                    py: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                }
            ]
        },

        arquebusier: {
            name: "Arquebusier",
            visual: [ ARMORED_VISUAL, ARMORED_1_VISUAL, ARMORED_2_VISUAL, ARMORED_3_VISUAL, ARMORED_4_VISUAL, ARMORED_5_VISUAL, ARMORED_6_VISUAL, ARMORED_7_VISUAL, ARMORED_8_VISUAL, ARMORED_9_VISUAL, ARMORED_10_VISUAL, ARMORED_11_VISUAL ],

            health: 10,
            armor: 1,
            size: 4.5,
            sizeY: 7.5,
            speed: 35,
            turnRate: Math.PI / 8,

            weapons: [
                {
                    weapon: "dagger",
                    x: 0,
                    y: -6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "arquebus",
                    x: 0,
                    y: 6.5,
                    px: 17.5,
                    py: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                }
            ]
        },

        archer: {
            name: "Archer",
            visual: [ ARCHER_VISUAL ],

            health: 10,
            armor: 1,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI / 2,

            weapons: [
                {
                    weapon: "recurve_bow",
                    x: 8,
                    y: 0,
                    px: 4,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        spear_sergeant: {
            name: "Sergeant",
            visual: [ GUARD_VISUAL ],

            health: 25,
            armor: 3,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI / 2,

            weapons: [
                {
                    weapon: "sword",
                    x: 0,
                    y: 6.5,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        sergeant: {
            name: "Sergeant",
            visual: [ MAN_VISUAL ],

            health: 20,
            armor: 2,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "laser_gun",
                    x: 0,
                    y: 6.5,
                    px: 12,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                },
                {
                    weapon: "thrown_grenade",
                    x: 0,
                    y: 0,
                    px: 10,
                    py: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                }
            ]
        },

        lightning_mage: {
            name: "Lightning Mage",
            visual: [ LIGHTNING_MAGE_VISUAL ],

            health: 60,
            armor: 4,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "lightning_spell",
                    x: 3,
                    y: 7,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6]
                }
            ]
        },

        flame_mage: {
            name: "Flame Mage",
            visual: [ FLAME_MAGE_VISUAL ],

            health: 60,
            armor: 4,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "fireball_spell",
                    x: 3,
                    y: 7,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6]
                }
            ]
        },

        priest: {
            name: "Priest",
            visual: [ PRIEST_VISUAL ],

            health: 80,
            armor: 5,
            size: 4.5,
            sizeY: 7.5,
            speed: 50,
            turnRate: 3 * Math.PI / 4,
            faceAllies: true,

            weapons: [
                {
                    weapon: "healing_spell",
                    x: -6,
                    y: 7,
                    px: 25,
                    py: -1,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                }
            ]
        },

        paladin: {
            name: "Paladin",
            visual: [ PALADIN_VISUAL, PALADIN_1_VISUAL, PALADIN_2_VISUAL, PALADIN_3_VISUAL, PALADIN_4_VISUAL, PALADIN_5_VISUAL, PALADIN_6_VISUAL, PALADIN_7_VISUAL, PALADIN_8_VISUAL, PALADIN_9_VISUAL ],

            health: 150,
            armor: 15,
            size: 4.5,
            sizeY: 7.5,
            speed: 50,
            turnRate: 3 * Math.PI / 4,

            weapons: [
                {
                    weapon: "greatsword",
                    x: 1,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                },
                {
                    weapon: "holy_smite",
                    x: 3,
                    y: -7,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6]
                }
            ]
        },

        angel: {
            name: "Angel",
            visual: [ ANGEL_MOVING_VISUAL ],

            health: 1000,
            armor: 20,
            size: 18,
            sizeY: 24,
            speed: 100,
            turnRate: 2 * Math.PI,
            flying: true,

            // moveVisual: [ ANGEL_MOVING_VISUAL ],
            // moveOverrides: true,
            weapons: [
                {
                    weapon: "angelic_sword",
                    x: 13,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                },
                {
                    weapon: "cleansing_aura",
                    x: 12,
                    y: 0,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI, Math.PI],
                    under: true
                },
                {
                    weapon: "healing_aura",
                    x: 12,
                    y: 0,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI, Math.PI],
                    under: true
                }
            ]
        },

        vampire_noble: {
            name: "Vampiric Noble",
            visual: [ BLOOD_MAGE_VISUAL ],

            health: 100,
            armor: 10,
            size: 4.5,
            sizeY: 7.5,
            speed: 90,
            turnRate: 2 * Math.PI,
            regen: 3,

            weapons: [
                {
                    weapon: "bloody_chalice",
                    x: 3,
                    y: -7,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6]
                },
                {
                    weapon: "vampire_sword",
                    x: 1,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        vampire: {
            name: "Vampire",
            visual: [ VAMPIRE_VISUAL, VAMPIRE_1_VISUAL, VAMPIRE_2_VISUAL, VAMPIRE_3_VISUAL, VAMPIRE_4_VISUAL, VAMPIRE_5_VISUAL, VAMPIRE_6_VISUAL, VAMPIRE_7_VISUAL, VAMPIRE_8_VISUAL, VAMPIRE_9_VISUAL ],

            health: 100,
            armor: 10,
            size: 4.5,
            sizeY: 7.5,
            speed: 80,
            turnRate: 2 * Math.PI,
            regen: 2,
            moveVisual: SMOKE_MOVE_VISUAL,
            weapons: [
                {
                    weapon: "vampire_sword",
                    x: 1,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        vampire_noble: {
            name: "Vampiric Noble",
            visual: [ BLOOD_MAGE_VISUAL ],

            health: 100,
            armor: 10,
            size: 4.5,
            sizeY: 7.5,
            speed: 90,
            turnRate: 2 * Math.PI,
            regen: 3,
            moveVisual: SMOKE_MOVE_VISUAL,
            weapons: [
                {
                    weapon: "bloody_chalice",
                    x: 3,
                    y: -7,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6]
                },
                {
                    weapon: "vampire_sword",
                    x: 1,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        guard: {
            name: "Guard",
            visual: [ GUARD_VISUAL, GUARD_1_VISUAL, GUARD_2_VISUAL, GUARD_3_VISUAL, GUARD_4_VISUAL, GUARD_5_VISUAL, GUARD_6_VISUAL, GUARD_7_VISUAL, GUARD_8_VISUAL, GUARD_9_VISUAL ],

            health: 30,
            armor: 3,
            size: 4.5,
            sizeY: 7.5,
            speed: 50,
            shield: 30,
            shieldRegen: 1,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "laser_pistol",
                    x: 0,
                    y: -7,
                    px: 6,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                },
                {
                    weapon: "sword",
                    x: 1,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                },
                {
                    weapon: "energy_shield",
                    x: 0,
                    y: 0,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI, Math.PI],
                    under: true
                }
            ]
        },

        guard_sergeant: {
            name: "Sergeant",
            visual: [ GUARD_3_VISUAL ],

            health: 50,
            armor: 4,
            size: 4.5,
            sizeY: 7.5,
            speed: 50,
            shield: 30,
            shieldRegen: 1,
            turnRate: Math.PI,

            weapons: [
                {
                    weapon: "laser_pistol",
                    x: 0,
                    y: -7,
                    px: 6,
                    py: 0,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                },
                {
                    weapon: "sword",
                    x: 1,
                    y: 7,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                },
                {
                    weapon: "energy_shield",
                    x: 0,
                    y: 0,
                    px: 0,
                    py: 0,
                    turnRange: [-Math.PI, Math.PI],
                    under: true
                },
                {
                    weapon: "thrown_grenade",
                    x: 0,
                    y: 0,
                    px: 10,
                    py: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                }
            ]
        },

        assault: {
            name: "Assault",
            visual: [ ASSAULT_VISUAL ],

            health: 20,
            armor: 2,
            size: 4.5,
            sizeY: 7.5,
            speed: 50,
            turnRate: 4 * Math.PI / 3,

            weapons: [
                {
                    weapon: "flamethrower",
                    x: -1,
                    y: 6,
                    px: 16,
                    py: 1,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                }
            ]
        },

        assault_sergeant: {
            name: "Sergeant",
            visual: [ ASSAULT_VISUAL ],

            health: 40,
            armor: 3,
            size: 4.5,
            sizeY: 7.5,
            speed: 50,
            turnRate: 4 * Math.PI / 3,

            weapons: [
                {
                    weapon: "flamethrower",
                    x: -1,
                    y: 6,
                    px: 16,
                    py: 1,
                    turnRange: [-Math.PI / 6, Math.PI / 6],
                    under: true
                },
                {
                    weapon: "thrown_grenade",
                    x: 0,
                    y: 0,
                    px: 10,
                    py: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                }
            ]
        },

        swordsman: {
            name: "Swordsman",
            visual: [ SHIELDED_VISUAL, SHIELDED_1_VISUAL, SHIELDED_2_VISUAL, SHIELDED_3_VISUAL, SHIELDED_4_VISUAL, SHIELDED_5_VISUAL ],

            health: 30,
            armor: 4,
            size: 4.5,
            sizeY: 7.5,
            speed: 40,
            turnRate: Math.PI / 3,

            weapons: [
                {
                    weapon: "sword",
                    x: 1,
                    y: 8,
                    px: 20,
                    py: 0,
                    turnRange: [-Math.PI / 8, Math.PI / 8],
                    under: true
                }
            ]
        },

        catapult: {
            name: "Catapult",
            visual: [ CATAPULT_VISUAL ],

            health: 50,
            armor: 8,
            size: 30,
            speed: 5,
            turnRate: Math.PI / 4,
            weapons: [
                {
                    weapon: "catapult",
                    x: 0,
                    y: 0,
                    px: 30,
                    py: 2.5,
                    turnRange: [0, 0]
                }
            ]
        },

        howitzer: {
            name: "Howitzer",
            visual: [ HOWITZER_VISUAL ],

            health: 50,
            armor: 4,
            size: 15,
            speed: 20,
            turnRate: Math.PI / 6,
            weapons: [
                {
                    weapon: "howitzer_cannon",
                    x: 0,
                    y: 0,
                    px: 30,
                    py: 2.5,
                    turnRange: [0, 0]
                }
            ]
        },

        knight: {
            name: "Paladin",
            visual: [ KNIGHT_VISUAL ],

            health: 250,
            armor: 20,
            size: 25,
            sizeY: 30,
            mass: 42_000,
            speed: 80,
            turnRate: Math.PI / 4,

            moveVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    strokeWeight(0);
                    translate(this.x, this.y);
                    rotate(this.a);
                    const cycle = this.timeElapsed % (this.cycle * 2);
                    const alpha = Math.min(
                        100 * (((cycle > this.cycle) ? (1 - cycle + this.cycle) / this.cycle : cycle / this.cycle) * 0.5 + 0.25),
                        this.transparency * 100
                    );
                    fill(255, 90, 0, alpha);
                    arc(-24, -25, 4, 10, PI + HALF_PI, HALF_PI);
                    arc(-24, -25, 30, 10, HALF_PI, PI + HALF_PI);
                    arc(-24, 25, 4, 10, PI + HALF_PI, HALF_PI);
                    arc(-24, 25, 30, 10, HALF_PI, PI + HALF_PI);
                    fill(255, 154, 0, alpha);
                    arc(-24, -25, 3, 6, PI + HALF_PI, HALF_PI);
                    arc(-24, -25, 22.5, 6, HALF_PI, PI + HALF_PI);
                    arc(-24, 25, 3, 6, PI + HALF_PI, HALF_PI);
                    arc(-24, 25, 22.5, 6, HALF_PI, PI + HALF_PI);
                    fill(255, 206, 0, alpha);
                    arc(-24, -25, 2, 4, PI + HALF_PI, HALF_PI);
                    arc(-24, -25, 15, 4, HALF_PI, PI + HALF_PI);
                    arc(-24, 25, 2, 4, PI + HALF_PI, HALF_PI);
                    arc(-24, 25, 15, 4, HALF_PI, PI + HALF_PI);
                    pop();
                }, 255, 0.25);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.cycle = 0.75;
                return visual;
            },

            weapons: [
                {
                    weapon: "large_railgun",
                    x: 0,
                    y: 25,
                    px: 40,
                    py: 2,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                },
                {
                    weapon: "large_railgun",
                    x: 0,
                    y: -25,
                    px: 40,
                    py: 2,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                },
                {
                    weapon: "short_machine_gun",
                    x: 20,
                    y: 0,
                    px: 4,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                }
            ]
        },

        horde_knight: {
            name: "Crusader",
            visual: [ CRUSADER_VISUAL ],

            health: 100,
            shield: 100,
            shieldRegen: 2,
            armor: 15,
            size: 20,
            sizeY: 40,
            mass: 40_000,
            speed: 80,
            turnRate: Math.PI / 4,

            moveVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    strokeWeight(0);
                    translate(this.x, this.y);
                    rotate(this.a);
                    const cycle = this.timeElapsed % (this.cycle * 2);
                    const alpha = Math.min(
                        100 * (((cycle > this.cycle) ? (1 - cycle + this.cycle) / this.cycle : cycle / this.cycle) * 0.5 + 0.25),
                        this.transparency * 100
                    );
                    fill(255, 90, 0, alpha);
                    arc(-30, 0, 8, 20, PI + HALF_PI, HALF_PI);
                    arc(-30, 0, 60, 20, HALF_PI, PI + HALF_PI);
                    fill(255, 154, 0, alpha);
                    arc(-30, 0, 6, 12, PI + HALF_PI, HALF_PI);
                    arc(-30, 0, 45, 12, HALF_PI, PI + HALF_PI);
                    fill(255, 206, 0, alpha);
                    arc(-30, 0, 4, 8, PI + HALF_PI, HALF_PI);
                    arc(-30, 0, 30, 8, HALF_PI, PI + HALF_PI);
                    pop();
                }, 255, 0.25);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.cycle = 0.75;
                return visual;
            },

            weapons: [
                {
                    weapon: "low_swarm_missile_launcher",
                    x: -10,
                    y: 30,
                    px: 16,
                    py: 0,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 2, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "low_swarm_missile_launcher",
                    x: -10,
                    y: -30,
                    px: 16,
                    py: 0,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 2, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "autocannon",
                    x: 5,
                    y: 30,
                    px: 25,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                },
                {
                    weapon: "autocannon",
                    x: 5,
                    y: -30,
                    px: 25,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 16, Math.PI / 16],
                    under: true
                }
            ]
        },
        // 

        tank: {
            name: "Tank",
            visual: [ TANK_VISUAL ],

            health: 150,
            armor: 20,
            size: 35,
            sizeY: 28,
            speed: 100,
            turnRate: Math.PI / 4,
            mass: 50_000,
            moveVisual: [ TANK_MOVING_VISUAL ],
            moveOverrides: true,
            weapons: [
                {
                    weapon: "tank_machine_gun",
                    x: 5,
                    y: 18,
                    px: 20,
                    py: 0,
                    angle: Math.PI / 4,
                    turnRange: [-Math.PI / 4, Math.PI / 4]
                },
                {
                    weapon: "tank_machine_gun",
                    x: 5,
                    y: -18,
                    px: 20,
                    py: 0,
                    angle: -Math.PI / 4,
                    turnRange: [-Math.PI / 4, Math.PI / 4]
                },
                {
                    weapon: "heavy_cannon",
                    x: 0,
                    y: 0,
                    px: 80,
                    py: 2.5,
                    turnRange: [-Math.PI, Math.PI]
                }
            ]
        },

        lancer: {
            name: "Lancer",
            visual: [ LANCER_VISUAL, LANCER_1_VISUAL, LANCER_2_VISUAL, LANCER_3_VISUAL ],

            health: 100,
            armor: 8,
            size: 20,
            sizeY: 8,
            speed: 150,
            turnRate: Math.PI,
            flying: true,

            moveVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    strokeWeight(0);
                    translate(this.x, this.y);
                    rotate(this.a);
                    const cycle = this.timeElapsed % (this.cycle * 2);
                    const alpha = Math.min(
                        100 * (((cycle > this.cycle) ? (1 - cycle + this.cycle) / this.cycle : cycle / this.cycle) * 0.5 + 0.25),
                        this.transparency * 100
                    );
                    fill(255, 90, 0, alpha);
                    arc(-27.5, 0, 4, 10, PI + HALF_PI, HALF_PI);
                    arc(-27.5, 0, 30, 10, HALF_PI, PI + HALF_PI);
                    fill(255, 154, 0, alpha);
                    arc(-27.5, 0, 3, 6, PI + HALF_PI, HALF_PI);
                    arc(-27.5, 0, 22.5, 6, HALF_PI, PI + HALF_PI);
                    fill(255, 206, 0, alpha);
                    arc(-27.5, 0, 2, 4, PI + HALF_PI, HALF_PI);
                    arc(-27.5, 0, 15, 4, HALF_PI, PI + HALF_PI);
                    pop();
                }, 255, 0.25);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.cycle = 0.75;
                return visual;
            },
            weapons: [
                {
                    weapon: "particle_lance",
                    x: 10,
                    y: 0,
                    px: 12,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4]
                },
                {
                    weapon: "missile_launcher",
                    x: -15,
                    y: -4,
                    px: 0,
                    py: 0,
                    angle: -Math.PI / 2,
                    turnRange: [0, Math.PI / 2],
                    under: true
                },
                {
                    weapon: "missile_launcher",
                    x: -15,
                    y: 4,
                    px: 0,
                    py: 0,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 2, 0],
                    under: true
                }
            ]
        },

        knight_archer: {
            name: "Horse Archer",
            visual: [ HORSEMAN_VISUAL, HORSEMAN_1_VISUAL, HORSEMAN_2_VISUAL, HORSEMAN_3_VISUAL ],

            health: 30,
            armor: 6,
            size: 20,
            sizeY: 8,
            speed: 120,
            turnRate: Math.PI / 2,

            weapons: [
                {
                    weapon: "horse_bow",
                    x: 8,
                    y: 0,
                    px: 4,
                    py: 0,
                    turnRange: [-Math.PI / 2, Math.PI / 2]
                }
            ]
        },

        knight_lancer: {
            name: "Knight",
            visual: [ HORSEMAN_VISUAL, HORSEMAN_1_VISUAL, HORSEMAN_2_VISUAL, HORSEMAN_3_VISUAL ],

            health: 30,
            armor: 6,
            size: 20,
            sizeY: 8,
            speed: 120,
            turnRate: Math.PI / 2,

            weapons: [
                {
                    weapon: "lance",
                    x: 2,
                    y: 7.5,
                    px: 0,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
            ]
        },

        dullahan: {
            name: "Dullahan",
            visual: [ DULLAHAN_VISUAL, DULLAHAN_1_VISUAL, DULLAHAN_2_VISUAL, DULLAHAN_3_VISUAL ],

            health: 50,
            armor: 6,
            size: 20,
            sizeY: 8,
            speed: 120,
            turnRate: Math.PI / 2,
            regen: 1,

            weapons: [
                {
                    weapon: "sword",
                    x: 1,
                    y: -7,
                    px: 20,
                    py: 0,
                    angle: -Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "lance",
                    x: 2,
                    y: 7.5,
                    px: 0,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
            ]
        },

        knight_commander: {
            name: "Knight Commander",
            visual: [ HORSEMAN_3_VISUAL ],

            health: 50,
            armor: 7,
            size: 20,
            sizeY: 8,
            speed: 120,
            turnRate: Math.PI / 2,

            weapons: [
                {
                    weapon: "lance",
                    x: 2,
                    y: 7.5,
                    px: 0,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "sword",
                    x: 1,
                    y: -7,
                    px: 20,
                    py: 0,
                    angle: -Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                }
            ]
        },

        citadel: {
            name: "Citadel",
            visual: [ CITADEL_VISUAL ],

            health: 500,
            armor: 20,
            size: 75,
            speed: 30,
            shield: 1000,
            shieldRegen: 2,
            turnRate: Math.PI / 8,
            flying: true,

            moveVisual: (x, y, a) => {
                const visual = new TemporaryVisual(function () {
                    push();
                    strokeWeight(0);
                    translate(this.x, this.y);
                    rotate(this.a + (3 * Math.PI / 16));
                    const cycle = this.timeElapsed % (this.cycle * 2);
                    const alpha = Math.min(
                        100 * (((cycle > this.cycle) ? (1 - cycle + this.cycle) / this.cycle : cycle / this.cycle) * 0.5 + 0.25),
                        this.transparency * 100
                    );
                    for (let i = 0; i < 4; i++) {
                        fill(255, 90, 0, alpha);
                        arc(-80, 0, 10, 25, PI + HALF_PI, HALF_PI);
                        arc(-80, 0, 80, 25, HALF_PI, PI + HALF_PI);
                        fill(255, 154, 0, alpha);
                        arc(-80, 0, 7.5, 15, PI + HALF_PI, HALF_PI);
                        arc(-80, 0, 60, 15, HALF_PI, PI + HALF_PI);
                        fill(255, 206, 0, alpha);
                        arc(-80, 0, 5, 10, PI + HALF_PI, HALF_PI);
                        arc(-80, 0, 40, 10, HALF_PI, PI + HALF_PI);
                        rotate(-Math.PI / 8);
                    }
                    pop();
                }, 255, 0.25);
                visual.x = x;
                visual.y = y;
                visual.a = a;
                visual.cycle = 0.75;
                return visual;
            },
            weapons: [
                {
                    weapon: "laser_turret",
                    x: 70,
                    y: 0,
                    px: 16,
                    py: 1,
                    angle: 0,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -70,
                    y: 0,
                    px: 16,
                    py: 1,
                    angle: -Math.PI,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 0,
                    y: 70,
                    px: 16,
                    py: 1,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 0,
                    y: -70,
                    px: 16,
                    py: 1,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 50,
                    y: 50,
                    px: 16,
                    py: 1,
                    angle: Math.PI / 4,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -50,
                    y: 50,
                    px: 16,
                    py: 1,
                    angle: 3 * Math.PI / 4,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 50,
                    y: -50,
                    px: 16,
                    py: 1,
                    angle: -Math.PI / 4,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -50,
                    y: -50,
                    px: 16,
                    py: 1,
                    angle: -3 * Math.PI / 4,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 70 * Math.cos(Math.PI / 8),
                    y: 70 * Math.sin(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -70 * Math.cos(Math.PI / 8),
                    y: 70 * Math.sin(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: 7 * Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 70 * Math.sin(Math.PI / 8),
                    y: 70 * Math.cos(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: 3 * Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -70 * Math.sin(Math.PI / 8),
                    y: 70 * Math.cos(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: 5 * Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 70 * Math.cos(Math.PI / 8),
                    y: -70 * Math.sin(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: -Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -70 * Math.cos(Math.PI / 8),
                    y: -70 * Math.sin(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: -7 * Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: 70 * Math.sin(Math.PI / 8),
                    y: -70 * Math.cos(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: -3 * Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "laser_turret",
                    x: -70 * Math.sin(Math.PI / 8),
                    y: -70 * Math.cos(Math.PI / 8),
                    px: 16,
                    py: 1,
                    angle: -5 * Math.PI / 8,
                    turnRange: [-Math.PI / 4, Math.PI / 4],
                    under: true
                },
                {
                    weapon: "citadel_exhaust",
                    x: 0,
                    y: 0,
                    px: 0,
                    py: 0,
                    angle: 0,
                    turnRange: [-Math.PI, Math.PI],
                    under: true
                }
            ]
        },

        castle: {
            name: "Castle",
            visual: [ CASTLE_VISUAL ],
            health: 2000,
            armor: 20,
            size: 200,
            sizeY: 223,
            speed: 0,
            static: true,
            turnRate: 1,
            regen: 2,

            weapons: [
                {
                    weapon: "arrow_tower",
                    x: 0,
                    y: -173,
                    px: 40,
                    py: 0,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: 0,
                    y: 173,
                    px: 40,
                    py: 0,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: 150,
                    y: -87,
                    px: 40,
                    py: 0,
                    angle: -Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: -150,
                    y: -87,
                    px: 40,
                    py: 0,
                    angle: -5 * Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: 150,
                    y: 87,
                    px: 40,
                    py: 0,
                    angle: Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: -150,
                    y: 87,
                    px: 40,
                    py: 0,
                    angle: 5 * Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
            ]
        },

        vampire_castle: {
            name: "Vampire Castle",
            visual: [ VAMP_CASTLE_VISUAL ],
            health: 2000,
            armor: 20,
            size: 200,
            sizeY: 223,
            speed: 0,
            static: true,
            turnRate: 1,
            regen: 2,

            weapons: [
                {
                    weapon: "arrow_tower",
                    x: 0,
                    y: -173,
                    px: 40,
                    py: 0,
                    angle: -Math.PI / 2,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: 0,
                    y: 173,
                    px: 40,
                    py: 0,
                    angle: Math.PI / 2,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: 150,
                    y: -87,
                    px: 40,
                    py: 0,
                    angle: -Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: -150,
                    y: -87,
                    px: 40,
                    py: 0,
                    angle: -5 * Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: 150,
                    y: 87,
                    px: 40,
                    py: 0,
                    angle: Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
                {
                    weapon: "arrow_tower",
                    x: -150,
                    y: 87,
                    px: 40,
                    py: 0,
                    angle: 5 * Math.PI / 6,
                    turnRange: [-Math.PI / 3, Math.PI / 3]
                },
            ]
        },

        fortified_camp: {
            name: "Fortified Camp",
            visual: [ FORTIFIED_BASE_VISUAL ],
            health: 2000,
            armor: 20,
            size: 160,
            sizeY: 160,
            speed: 0,
            static: true,
            turnRate: 1,
            regen: 2,

            weapons: [
                {
                    weapon: "base_defender",
                    x: 40.49,
                    y: -92.12,
                    px: 12,
                    py: 6.5,
                    angle: -Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "base_defender",
                    x: 59.51,
                    y: -81.21,
                    px: 12,
                    py: 6.5,
                    angle: -Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },

                // Right vertical edge
                {
                    weapon: "base_defender",
                    x: 100.00,
                    y: -11.33,
                    px: 12,
                    py: 6.5,
                    angle: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "base_defender",
                    x: 100.00,
                    y: 11.33,
                    px: 12,
                    py: 6.5,
                    angle: 0,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },

                // Bottom-right edge
                {
                    weapon: "base_defender",
                    x: 59.51,
                    y: 81.21,
                    px: 12,
                    py: 6.5,
                    angle: Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "base_defender",
                    x: 40.49,
                    y: 92.12,
                    px: 12,
                    py: 6.5,
                    angle: Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },

                // Bottom-left edge
                {
                    weapon: "base_defender",
                    x: -40.49,
                    y: 92.12,
                    px: 12,
                    py: 6.5,
                    angle: 2 * Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "base_defender",
                    x: -59.51,
                    y: 81.21,
                    px: 12,
                    py: 6.5,
                    angle: 2 * Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },

                // Left vertical edge
                {
                    weapon: "base_defender",
                    x: -100.00,
                    y: 11.33,
                    px: 12,
                    py: 6.5,
                    angle: -Math.PI,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "base_defender",
                    x: -100.00,
                    y: -11.33,
                    px: 12,
                    py: 6.5,
                    angle: Math.PI,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },

                // Top-left edge
                {
                    weapon: "base_defender",
                    x: -59.51,
                    y: -81.21,
                    px: 12,
                    py: 6.5,
                    angle: -2 * Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
                {
                    weapon: "base_defender",
                    x: -40.49,
                    y: -92.12,
                    px: 12,
                    py: 6.5,
                    angle: -2 * Math.PI / 3,
                    turnRange: [-Math.PI / 3, Math.PI / 3],
                    under: true
                },
            
            ]
        }
    },
    squads: {
        // MIDNIGHT ARISTOCRACY
        zombie_horde: {
            name: "Zombie Horde",
            cost: 500,
            pros: [ squadProsCons.regen, squadProsCons.high_health ],
            cons: [ squadProsCons.very_slow, squadProsCons.low_dmg ],
            troops: [
                { troop: "zombie", count: 81 }
            ],

            formation: eightyManFormation
        },
        skeleton_spear_regiment: {
            name: "Skeleton Spearmen",
            cost: 700,
            pros: [ squadProsCons.regen ],
            cons: [ squadProsCons.slow ],

            troops: [
                { troop: "skeleton_spearman", count: 81 }
            ],

            formation: eightyManFormation
        },
        skeleton_archer_regiment: {
            name: "Skeleton Archers",
            cost: 800,
            pros: [ squadProsCons.regen, squadProsCons.poison ],
            cons: [ squadProsCons.slow, squadProsCons.cant_attack_move ],

            troops: [
                { troop: "skeleton_archer", count: 81 }
            ],

            formation: eightyManFormation
        },
        spirit_host: {
            name: "Spirit Host",
            cost: 1000,
            pros: [ squadProsCons.fast, squadProsCons.regen, squadProsCons.armor ],
            cons: [ squadProsCons.low_count, squadProsCons.low_health ],

            troops: [
                { troop: "spirit", count: 41 }
            ],

            formation: eightyManFormation
        },
        dullahan_squad: {
            name: "Dullahan",
            cost: 1500,
            pros: [ squadProsCons.dual_wield, squadProsCons.fast, squadProsCons.regen, squadProsCons.armor ],
            cons: [ squadProsCons.low_count ],

            troops: [
                { troop: "dullahan", count: 15 }
            ],

            formation: wedgeFormation
        },
        reaper_squad: {
            name: "Reapers",
            cost: 1800,
            pros: [ squadProsCons.ap, squadProsCons.flying, squadProsCons.fast, squadProsCons.regen, squadProsCons.armor],
            cons: [ squadProsCons.low_health, squadProsCons.low_count ],

            troops: [
                { troop: "reaper", count: 3 }
            ],

            formation: [
                new Position(10, 0, 0),
                new Position(-10, 15, 0),
                new Position(-10, -15, 0)
            ]
        },
        vampire_squad: {
            name: "Vampires",
            cost: 2000,
            pros: [ squadProsCons.large_area, squadProsCons.regen, squadProsCons.lifesteal, squadProsCons.armor ],
            cons: [ squadProsCons.low_count ],

            troops: [
                { troop: "vampire", count: 3 }
            ],

            formation: [
                new Position(10, 0, 0),
                new Position(-10, 15, 0),
                new Position(-10, -15, 0)
            ]
        },
        vampiric_nobility: {
            name: "Vampire Noble",
            cost: 2000,
            pros: [ squadProsCons.large_area, squadProsCons.piercing, squadProsCons.regen, squadProsCons.lifesteal, squadProsCons.armor, squadProsCons.hybrid ],
            cons: [ squadProsCons.single_entity, squadProsCons.low_range],

            troops: [
                { troop: "vampire_noble", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        vampire_castle_base: {
            name: "Vampire Castle",

            pros: [],
            cons: [],
            static: true,

            troops: [
                { troop: "vampire_castle", count: 1 },
                { troop: "skeleton_archer", count: 18 }
            ],

            formation: [
                new Position(0, 0, 0),
                // Top-right edge
                new Position(60.73, -138.18),
                new Position(75.00, -130.00),
                new Position(89.27, -121.82),

                // Right vertical edge
                new Position(150.00, -17.00),
                new Position(150.00, 0.00),
                new Position(150.00, 17.00),

                // Bottom-right edge
                new Position(89.27, 121.82),
                new Position(75.00, 130.00),
                new Position(60.73, 138.18),

                // Bottom-left edge
                new Position(-60.73, 138.18),
                new Position(-75.00, 130.00),
                new Position(-89.27, 121.82),

                // Left vertical edge
                new Position(-150.00, 17.00),
                new Position(-150.00, 0.00),
                new Position(-150.00, -17.00),

                // Top-left edge
                new Position(-89.27, -121.82),
                new Position(-75.00, -130.00),
                new Position(-60.73, -138.18),
            ]
        },
        // EMPIRE
        spear_regiment: {
            name: "Spearmen",
            cost: 800,
            pros: [],
            cons: [ squadProsCons.low_dmg ],

            troops: [
                { troop: "spear_sergeant", count: 1 },
                { troop: "spearman", count: 80 }
            ],

            formation: eightyManFormation
        },
        pike_regiment: {
            name: "Pikemen",
            cost: 1000,
            pros: [ squadProsCons.dmg, squadProsCons.reach ],
            cons: [ squadProsCons.slow ],

            troops: [
                { troop: "spear_sergeant", count: 1 },
                { troop: "pikeman", count: 80 }
            ],

            formation: eightyManFormation
        },
        tercio_regiment: {
            name: "Tercio",
            cost: 1000,
            pros: [ squadProsCons.dmg, squadProsCons.reach, squadProsCons.hybrid ],
            cons: [ squadProsCons.cant_attack_move, squadProsCons.slow ],

            troops: [
                { troop: "tercio_officer", count: 1 },
                { troop: "pikeman", count: 40 },
                { troop: "arquebusier", count: 40 }
            ],

            iconicTroop: "tercio_officer",

            formation: eightyLineFirstFormation
        },
        // 
        sword_regiment: {
            name: "Swordsmen",
            cost: 1000,
            pros: [ squadProsCons.dmg, squadProsCons.fast ],
            cons: [ squadProsCons.low_count ],

            troops: [
                { troop: "spear_sergeant", count: 1 },
                { troop: "swordsman", count: 40 }
            ],

            formation: eightyManFormation
        },
        archer_regiment: {
            name: "Archers",
            cost: 900,
            pros: [ squadProsCons.fast ],
            cons: [ squadProsCons.low_armor, squadProsCons.cant_attack_move ],

            troops: [
                { troop: "spear_sergeant", count: 1 },
                { troop: "archer", count: 80 }
            ],

            formation: eightyManFormation
        },
        knight_lancer_squad: {
            name: "Knights",
            cost: 2000,
            pros: [ squadProsCons.fast, squadProsCons.armor ],
            cons: [],

            troops: [
                { troop: "knight_commander", count: 1 },
                { troop: "knight_lancer", count: 29 }
            ],

            formation: wedgeFormation
        },
        knight_archer_squad: {
            name: "Horse Archers",
            cost: 1900,
            pros: [ squadProsCons.fast ],
            cons: [ squadProsCons.low_accuracy ],

            troops: [
                { troop: "knight_commander", count: 1 },
                { troop: "knight_archer", count: 29 }
            ],

            formation: wedgeFormation
        },
        catapult_squad: {
            name: "Catapult Battery",
            cost: 1500,
            pros: [ squadProsCons.large_area, squadProsCons.range ],
            cons: [ squadProsCons.very_slow, squadProsCons.cant_attack_move ],

            troops: [
                { troop: "catapult", count: 3 }
            ],

            formation: [
                new Position(30, 0, 0),
                new Position(-20, 30, 0),
                new Position(-20, -30, 0)
            ]
        },
        mage_cadre: {
            name: "Mage Cadre",
            cost: 2000,
            pros: [ squadProsCons.large_area, squadProsCons.range ],
            cons: [ squadProsCons.low_health, squadProsCons.low_armor ],

            troops: [
                { troop: "flame_mage", count: 2 },
                { troop: "lightning_mage", count: 2 },
                // { troop: "priest", count: 1 }
            ],

            formation: [
                new Position(10, 10, 0),
                new Position(10, -10, 0),
                new Position(-10, -10, 0),
                new Position(-10, 10, 0),
                // new Position(-10, -15, 0),
                // new Position(-10, 15, 0),
                // new Position(-15, 0, 0)
            ]
        },
        priestly_choir: {
            name: "Choir",
            cost: 3000,
            pros: [ squadProsCons.large_area, squadProsCons.armor, squadProsCons.heals ],
            cons: [ squadProsCons.low_range ],

            troops: [
                { troop: "paladin", count: 3 },
                { troop: "priest", count: 2 }
            ],

            formation: [
                new Position(25, 0, 0),
                new Position(16.6, -25, 0),
                new Position(16.6, 25, 0),
                new Position(-16.6, 15, 0),
                new Position(-16.6, -15, 0)
            ]
        },
        angel_squad: {
            name: "Angel",
            cost: 3000,
            pros: [ squadProsCons.large_area, squadProsCons.armor, squadProsCons.flying, squadProsCons.heals, squadProsCons.area ],
            cons: [ squadProsCons.single_entity ],
            iconicTroop: "angel",
            troops: [
                { troop: "angel", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        castle_base: {
            name: "Castle",

            pros: [],
            cons: [],
            static: true,

            troops: [
                { troop: "castle", count: 1 },
                { troop: "archer", count: 18 }
            ],

            formation: [
                new Position(0, 0, 0),
                // Top-right edge
                new Position(60.73, -138.18),
                new Position(75.00, -130.00),
                new Position(89.27, -121.82),

                // Right vertical edge
                new Position(150.00, -17.00),
                new Position(150.00, 0.00),
                new Position(150.00, 17.00),

                // Bottom-right edge
                new Position(89.27, 121.82),
                new Position(75.00, 130.00),
                new Position(60.73, 138.18),

                // Bottom-left edge
                new Position(-60.73, 138.18),
                new Position(-75.00, 130.00),
                new Position(-89.27, 121.82),

                // Left vertical edge
                new Position(-150.00, 17.00),
                new Position(-150.00, 0.00),
                new Position(-150.00, -17.00),

                // Top-left edge
                new Position(-89.27, -121.82),
                new Position(-75.00, -130.00),
                new Position(-60.73, -138.18),
            ]
        },
        // VISITORS
        rifle_squad: {
            name: "Rifle Squad",
            cost: 800,
            pros: [ squadProsCons.rapid_reload ],
            cons: [ squadProsCons.low_count ],

            troops: [
                { troop: "sergeant", count: 1 },
                { troop: "soldier", count: 10 }
            ],

            formation: tenManFormation
        },
        assault_squad: {
            name: "Assault Squad",
            cost: 1000,
            pros: [ squadProsCons.large_area, squadProsCons.flamethrower ],
            cons: [ squadProsCons.low_range ],

            troops: [
                { troop: "assault_sergeant", count: 1 },
                { troop: "assault", count: 10 }
            ],

            formation: tenManFormation
        },
        guard_squad: {
            name: "Guardians",
            cost: 1200,
            pros: [ squadProsCons.shield, squadProsCons.armor, squadProsCons.hybrid, squadProsCons.area ],
            cons: [ squadProsCons.low_count ],

            troops: [
                { troop: "guard", count: 3 }
            ],

            formation: [
                new Position(10, 0, 0),
                new Position(-10, 15, 0),
                new Position(-10, -15, 0)
            ]
        },
        lancer_squad: {
            name: "Lancer Squad",
            cost: 2000,
            pros: [ squadProsCons.fast, squadProsCons.flying, squadProsCons.homing ],
            cons: [ squadProsCons.low_count, squadProsCons.low_armor ],

            troops: [
                { troop: "lancer", count: 3 }
            ],

            formation: [
                new Position(20, 0, 0),
                new Position(-20, 23, 0),
                new Position(-20, -23, 0)
            ]
        },
        artillery_squad: {
            name: "Artillery Battery",
            cost: 1500,
            pros: [ squadProsCons.large_area, squadProsCons.range ],
            cons: [ squadProsCons.very_slow, squadProsCons.cant_attack_move ],

            troops: [
                { troop: "howitzer", count: 3 }
            ],

            formation: [
                new Position(20, 0, 0),
                new Position(-20, 23, 0),
                new Position(-20, -23, 0)
            ]
        },
        tank_squad: {
            name: "Tank",
            cost: 1500,
            pros: [ squadProsCons.large_area, squadProsCons.rapid_reload, squadProsCons.fast, squadProsCons.range ],
            cons: [ squadProsCons.single_entity ],

            troops: [
                { troop: "tank", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        knight_squad: {
            name: "Paladin",
            cost: 2500,
            pros: [ squadProsCons.piercing, squadProsCons.rapid_reload, squadProsCons.low_range ],
            cons: [ squadProsCons.single_entity ],

            troops: [
                { troop: "knight", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        crusader_squad: {
            name: "Crusader",
            cost: 2700,
            pros: [ squadProsCons.range, squadProsCons.large_area, squadProsCons.homing, squadProsCons.shield ],
            cons: [ squadProsCons.single_entity, squadProsCons.low_health ],

            troops: [
                { troop: "horde_knight", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        citadel_squad: {
            name: "Citadel",
            cost: 5000,
            pros: [ squadProsCons.multi_turret, squadProsCons.area, squadProsCons.armor, squadProsCons.shield, squadProsCons.flying ],
            cons: [ squadProsCons.single_entity, squadProsCons.slow ],

            troops: [
                { troop: "citadel", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        battleship_squad: {
            name: "Battleship",

            pros: [ squadProsCons.broadside ],
            cons: [ squadProsCons.very_slow ],

            troops: [
                { troop: "battleship", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        destroyer_squad: {
            name: "Destroyer",

            pros: [ squadProsCons.homing ],
            cons: [ squadProsCons.slow ],

            troops: [
                { troop: "destroyer", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        fortified_camp_base: {
            name: "Fortified Camp",

            pros: [],
            cons: [],
            static: true,

            troops: [
                { troop: "fortified_camp", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
        // MONSTERS
        spider_horde: {
            name: "Spiders",
            cost: 500,
            pros: [ squadProsCons.fast ],
            cons: [ squadProsCons.unarmored ],

            troops: [
                { troop: "spider", count: 30 }
            ],

            formation: wedgeFormation
        },
        troll_tribe: {
            name: "Troll Tribe",
            cost: 1000,
            pros: [ squadProsCons.regen, squadProsCons.high_health ],
            cons: [ squadProsCons.slow, squadProsCons.low_count, squadProsCons.unarmored ],

            troops: [
                { troop: "troll", count: 3 }
            ],

            formation: [
                new Position(20, 0, 0),
                new Position(-20, 30, 0),
                new Position(-20, -30, 0)
            ]
        },
        giant: {
            name: "Giant",
            cost: 3000,
            pros: [ squadProsCons.very_health, squadProsCons.massive_area, squadProsCons.regen ],
            cons: [ squadProsCons.single_entity, squadProsCons.unarmored ],

            troops: [
                { troop: "giant", count: 1 }
            ],

            formation: [
                new Position(0, 0, 0)
            ]
        },
    }
};