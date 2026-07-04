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

# vision

thinking of using pydantic for data validation


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
