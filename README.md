# Introduction

Fotclan is a social network for footballers

## Next Steps

- [ ] fix the stats page and make it functional
- [ ] fix the leagues template
- [ ] fix the football spot template


# Extra features for monad deltav

- [ ] change to competions in general, add one for tagging fotclan
- [ ] research competitions and games theory
- [ ] add league availability beside league and add option to filter active


# weekly update

## objectives

- [x] custom domain
- [x] fixed some ui quirks
- [x] update the default table view
- [ ] update the zero index


# assumptions and tradeoffs

1. able to update past events trading immutability for ease of use
   git makes it work for now as i move to a server enviroment i will use a trail to keep track of changes
2. events order matters to make rendering eaisier


# set
- current_round: int
- rounds: str
    - str : {
        teams: [],
        fixtures: [],
            - home
            - away
            - datetime
            - events
        table: [{},],
    }

# league
- current_round
- teams: [str -> list[str]],
- fixtures: [],
    - home
    - away
    - datetime
    - events
- titles
- rounds
    - str : {
        table: [{},],
        player_stats: [],
        team_stats: []
    }

# multiple leagues
- current_round
- teams: [],
- fixtures: [],
    - home
    - away
    - datetime
    - events
- titles
- rounds
    - str : {
        tables: [[{},],],
        player_stats: [],
        team_stats: []
    }

sub

                Event(
                    fixture="",
                    name="sub",
                    event={
                        "side": "h",
                        "in": "Aremu",
                        "out": "Brainee",
                    },
                ),

                Event(
                    fixture="",
                    name="goal",
                    event={
                        "side": "h",
                        "scorer": "Kunle",
                        "assist": "",
                        "is_own_goal": False,
                        "is_penalty": False,
                    },
                ),

                Event(
                    fixture="",
                    name="yellow_card",
                    event={
                        "side": "h",
                        "player": "Sancho",
                    },
                ),

# components

- table
    - group name
    - heading
    - team entry
- fixture
    - scoreline
    - events
- stats
    - stats group
        - stats name
        - player/ team
- stats view
    - competition
    - stats
    - controls
    - entries
- new landing page


Recreate the attached webpage EXACTLY like the screenshot as an HTML + JavaScript implementation using Tailwind CSS. Treat the screenshot as the primary visual reference. Use the captured page structure from the imported site as the structural reference and the attached DESIGN.md as a secondary design-system token and asset reference. Use DESIGN.md only to preserve tokenized design-system cues and asset references, especially typography, spacing rhythm, radii, component styling, accessibility cues, evidenced motion cues, and listed media. If DESIGN.md conflicts with the screenshot on colors, surfaces, layout, or composition, follow the screenshot. Avoid long inline SVG markup unless there is no practical alternative. Let the screenshot drive styling decisions instead of adding extra interpretation.