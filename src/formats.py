import json
import pathlib
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Callable

from pydantic import BaseModel, Field
from jinja2 import Template

DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"
DATE_FORMAT = "%Y-%m-%d"
TIME_FORMAT = "%H:%M:%S"


class Goal(BaseModel):
    scorer: str
    assist: str
    own_goal: bool = False


class Team(BaseModel):
    name: str
    players: list[str]

    @staticmethod
    def map_teams(teams: list["Team"]) -> dict[str, "Team"]:
        result = {}
        for team in teams:
            result[team.name] = team
        return result


def select(prompt: str, error: str, exit_str: str, options: set | None) -> str:
    gotten = ""
    while not gotten:
        print(f"press {exit_str} any time to cancel")
        value = input(prompt)
        if value == exit_str:
            break
        if options is not None and value not in options:
            print(error)
        else:
            gotten = value
    if not gotten:
        raise ValueError("Failed to get the correct value!")
    return gotten


class Event(BaseModel):
    fixture: str
    name: str
    event: dict

    @staticmethod
    def bind(home: str, away: str, datetime: datetime | None = None) -> str:
        date_str = f"_at_{datetime}" if datetime is not None else ""
        return f"{home}_vs_{away}{date_str}"

    @staticmethod
    def input_penalty_shootout(fixture: str) -> "Event":
        result = None
        while result is None:
            shots = []
            try:
                shot_count = int(input("Enter the number of shoots in the shootout: "))
            except NameError:
                print(f"Invalid integer!, try Again...")
                continue

            for _ in range(shot_count):
                side = select(
                    "Enter home or away to select the team side: ",
                    "Expected home, h or away, a",
                    "!q",
                    {"home", "h", "away", "a"},
                )
                scored = input("Enter any character if the shot was saved: ")

                shots.append({"side": side[0], "scored": bool(scored)})
            result = Event(
                fixture=fixture,
                name="penalty_shootout",
                event={"shots": shots},
            )
        return result

    @staticmethod
    def input_goal(fixture: str) -> "Event":
        side = select(
            "Enter home or away to select the team side: ",
            "Expected home, h or away, a",
            "!q",
            {"home", "h", "away", "a"},
        )
        scorer = input("Enter the goal scorer: ")
        assist = input("Enter the assist provider: ")
        own_goal = input("Enter any characters if it was an own goal: ")
        penalty_goal = input("Enter any characters if it was a penalty goal: ")
        result = Event(
            fixture=fixture,
            name="goal",
            event={
                "side": side[0],
                "scorer": scorer,
                "assist": assist,
                "is_own_goal": own_goal != "",
                "is_penalty": penalty_goal != "",
            },
        )
        return result

    @staticmethod
    def input_red_card(fixture: str) -> "Event":
        side = select(
            "Enter home or away to select the team side: ",
            "Expected home, h or away, a",
            "!q",
            {"home", "h", "away", "a"},
        )
        recipient = input("Enter the recipient name: ")
        result = Event(
            fixture=fixture,
            name="red_card",
            event={"side": side[0], "player": recipient},
        )
        return result

    @staticmethod
    def input_yellow_card(fixture: str) -> "Event":
        side = select(
            "Enter home or away to select the team side: ",
            "Expected home, h or away, a",
            "!q",
            {"home", "h", "away", "a"},
        )
        recipient = input("Enter the recipient name: ")
        result = Event(
            fixture=fixture,
            name="yellow_card",
            event={"side": side[0], "player": recipient},
        )
        return result

    @staticmethod
    def input_sub(fixture: str) -> "Event":
        side = select(
            "Enter home or away to select the team side: ",
            "Expected home, h or away, a",
            "!q",
            {"home", "h", "away", "a"},
        )
        player_in = input("Enter the player in: ")
        player_out = input("Enter the player out: ")
        result = Event(
            fixture=fixture,
            name="sub",
            event={"side": side[0], "in": player_in, "put": player_out},
        )
        return result

    @staticmethod
    def handle_event(event_name: str, fixture: str) -> "Event | None":
        if event_name == "goal":
            return Event.input_goal(fixture)
        elif event_name == "penalty_shootout":
            return Event.input_penalty_shootout(fixture)
        elif event_name == "sub":
            return Event.input_sub(fixture)
        elif event_name == "yellow card":
            return Event.input_yellow_card(fixture)
        elif event_name == "red card":
            return Event.input_red_card(fixture)
        return None


class Fixture(BaseModel):
    home: str
    away: str
    date: datetime
    events: list[Event] | None = None

    @staticmethod
    def group_by_datetime(
        fixtures: list["Fixture"],
    ) -> dict[str, dict[str, list["Fixture"]]]:
        matchday_group: dict[str, dict[str, list["Fixture"]]] = {}
        for fixture in fixtures:
            date_str = fixture.date.strftime(DATE_FORMAT)
            time_str = fixture.date.strftime(TIME_FORMAT)
            if date_str not in matchday_group:
                matchday_group[date_str] = {}
            if time_str not in matchday_group[date_str]:
                matchday_group[date_str][time_str] = []
            matchday_group[date_str][time_str].append(fixture)
        return matchday_group

    def model_post_init(self, _) -> None:
        event_map: dict[str, list[dict]] = {}
        if self.events is None:
            return None
        for event in self.events:
            if event.name not in event_map:
                event_map[event.name] = []
            event_map[event.name].append(event.event)
        self.map = event_map


class Renderer:
    def __init__(self, template: pathlib.PurePath, output: pathlib.PurePath) -> None:
        self.template = template
        self.output = output

    def render(self, data: dict) -> None:
        with open(self.template) as f:
            template = Template(f.read())
        rendered = template.render(**data)
        with open(self.output, "w") as f:
            f.write(rendered)


class IndividualTable(BaseModel):
    name: str = ""
    points: int = 0
    played: int = 0
    wins: int = 0
    draws: int = 0
    loses: int = 0
    goals: int = 0
    assists: int = 0
    cleansheets: int = 0
    red_cards: int = 0
    yellow_cards: int = 0

    @staticmethod
    def map_players(stats: list["IndividualTable"]):
        result: dict[str, "IndividualTable"] = {}
        for stat in stats:
            result[stat.name] = stat
        return result


class TeamTable(BaseModel):
    team: str = ""
    points: int = 0
    played: int = 0
    wins: int = 0
    draws: int = 0
    loses: int = 0
    goals_scored: int = 0
    goals_conceded: int = 0
    cleansheets: int = 0
    red_cards: int = 0
    yellow_cards: int = 0

    @staticmethod
    def map_teams(stats: list["TeamTable"]) -> dict[str, "TeamTable"]:
        result = {}
        for stat in stats:
            result[stat.team] = stat
        return result


class LeagueRoundData(BaseModel):
    players_stats: IndividualTable
    team_stats: TeamTable


class LeagueData(BaseModel):
    current_round: int
    teams: dict[str, list[str]]
    fixtures: list[Fixture]
    titles: dict[str, str]
    round_data: dict[str, LeagueRoundData]


class Leagues_RoundData(BaseModel):
    table: dict[str, list[str]]
    players_stats: list[IndividualTable]
    team_stats: list[TeamTable]


class LeaguesData(BaseModel):
    current_round: int
    teams: dict[str, list[str]]
    fixtures: list[Fixture]
    titles: dict[str, str]
    round_data: dict[str, Leagues_RoundData]


def save(model: BaseModel, path: pathlib.PurePath) -> None:
    with open(path, "w") as f:
        json.dump(model.model_dump_json(), f, indent=2)


def input_teams() -> list[Team]:
    num_teams = int(input("Enter number of teams: "))
    teams = []
    for i in range(int(num_teams)):
        team_name = input(f"Enter name of team {i + 1}: ")
        team_name = f"{i + 1}" if team_name == "" else team_name
        players = input(f"Enter players in team {team_name}, seperated by space: ")
        teams.append(Team(name=team_name, players=players.split(" ")))
    return teams


def input_fixture(
    home: str, away: str, date: datetime | str, timezone: str = "Africa/Lagos"
) -> Fixture:
    if isinstance(date, str):
        # "2024-01-15 10:30:00"
        date = datetime.strptime(date, DATETIME_FORMAT)
    date = date.replace(tzinfo=ZoneInfo(timezone))
    events = []
    num_events = int(input(f"Enter the number of events: "))

    for _ in range(num_events):
        event_name = input("Enter the name of the event: ")
        fixture_name = Event.bind(home, away, date)
        event = Event.handle_event(event_name, fixture_name)
        if event is None:
            print(f"no handler for {event_name}! \n")
            event_data = json.loads(input("Enter the event data as valid json dict: "))
            event = Event(fixture=fixture_name, name=event_name, event=event_data)
        events.append(event)
    result = Fixture(home=home, away=away, date=date, events=events)

    result.events = events
    return result


def increment_player(
    players: list[str], key: str, value: int, player_map: dict[str, IndividualTable]
) -> None:
    for player in players:
        previous_value = getattr(player_map[player], key)
        setattr(player_map[player], key, previous_value + value)


def set_player(
    players: list[str], key: str, value: int, player_map: dict[str, IndividualTable]
) -> None:
    for player in players:
        setattr(player_map[player], key, value)


def apply_league_statistics(
    fixtures: list[Fixture],
    player_table: list[IndividualTable],
    team_table: list[TeamTable],
    teams: list[Team],
) -> tuple[list[IndividualTable], list[TeamTable]]:
    teams_name_map = Team.map_teams(teams)
    player_map = IndividualTable.map_players(player_table)
    team_map = TeamTable.map_teams(team_table)

    for fixture in fixtures:
        fixture_map = fixture.map
        home_goals = [g for g in fixture_map["goals"] if g["side"] == "h"]
        away_goals = [g for g in fixture_map["goals"] if g["side"] == "a"]

        team_map[fixture.home].played += 1
        team_map[fixture.away].played += 1

        team_map[fixture.home].goals_conceded += len(away_goals)
        team_map[fixture.home].goals_scored += len(home_goals)
        team_map[fixture.away].goals_conceded += len(home_goals)
        team_map[fixture.away].goals_scored += len(away_goals)

        if len(home_goals) == len(away_goals):
            team_map[fixture.home].draws += 1
            team_map[fixture.home].points += 1
            team_map[fixture.away].draws += 1
            team_map[fixture.away].points += 1
        elif len(home_goals) > len(away_goals):
            team_map[fixture.home].points += 3
            team_map[fixture.home].wins += 1
            team_map[fixture.away].loses += 1
        else:
            team_map[fixture.home].loses += 1
            team_map[fixture.away].wins += 1
            team_map[fixture.away].points += 3

        if len(away_goals) == 0:
            team_map[fixture.home].cleansheets += 1
        if len(home_goals) == 0:
            team_map[fixture.away].cleansheets += 1
        
        home_players = teams_name_map[fixture.home]
        away_players = teams_name_map[fixture.away]

        for player in home_players.players:
            player_map[player].played += team_map[fixture.home].played
            player_map[player].points += team_map[fixture.home].points
            player_map[player].wins += team_map[fixture.home].wins
            player_map[player].draws += team_map[fixture.home].draws
            player_map[player].loses += team_map[fixture.home].loses

        for player in away_players.players:
            player_map[player].played += team_map[fixture.away].played
            player_map[player].points += team_map[fixture.away].points
            player_map[player].wins += team_map[fixture.away].wins
            player_map[player].draws += team_map[fixture.away].draws
            player_map[player].loses += team_map[fixture.away].loses

        for goal in fixture_map["goals"]:
            player_map[goal["scorer"]].goals += 1
            if "assist" in goal:
                player_map[goal["assist"]].assists += 1

        for yellow in fixture_map["yellow_card"]:
            player_map[yellow["player"]].yellow_cards += 1

        for red in fixture_map["red_card"]:
            player_map[red["player"]].red_cards += 1

        team_map[fixture.home].red_cards += len([item for item in fixture_map["red_card"] if item["side"] == "h"])
        team_map[fixture.away].red_cards += len([item for item in fixture_map["red_card"] if item["side"] == "a"])

        team_map[fixture.home].yellow_cards += len([item for item in fixture_map["yellow_card"] if item["side"] == "h"])
        team_map[fixture.away].yellow_cards += len([item for item in fixture_map["yellow_card"] if item["side"] == "a"])

    return (
        [result for result in player_map.values()],
        [team for team in team_map.values()],
    )


def apply_set_statistics(
    fixtures: list[Fixture], player_table: list[IndividualTable], teams: list[Team]
) -> list[IndividualTable]:
    teams_map = Team.map_teams(teams)
    player_map = IndividualTable.map_players(player_table)

    for fixture in fixtures:
        fixture_map = fixture.map

        home_goals = [g for g in fixture_map["goals"] if g["side"] == "h"]
        away_goals = [g for g in fixture_map["goals"] if g["side"] == "a"]

        home_players = teams_map[fixture.home]
        away_players = teams_map[fixture.away]

        home_table = TeamTable()
        away_table = TeamTable()

        if len(home_goals) == len(away_goals):
            home_table.points += 1
            away_table.points = 1
            home_table.draws += 1
        elif len(home_goals) > len(away_goals):
            home_table.points += 3
            home_table.wins += 1
            away_table.loses += 1
        else:
            away_table.points += 3
            away_table.wins += 1
            home_table.loses += 1

        if len(away_goals) == 0:
            away_table.cleansheets += 1
        if len(home_goals) == 0:
            home_table.cleansheets += 1

        for goal in fixture_map["goals"]:
            player_map[goal["scorer"]].goals += 1
            if "assist" in goal:
                player_map[goal["assist"]].assists += 1

        for yellow in fixture_map["yellow_card"]:
            player_map[yellow["player"]].yellow_cards += 1

        for red in fixture_map["red_card"]:
            player_map[red["player"]].red_cards += 1

        for player in home_players.players:
            player_map[player].played += 1
            player_map[player].points += home_table.points
            player_map[player].wins += home_table.wins
            player_map[player].draws += home_table.draws
            player_map[player].loses += home_table.loses
            player_map[player].cleansheets += home_table.cleansheets

        for player in away_players.players:
            player_map[player].played += 1
            player_map[player].points += away_table.points
            player_map[player].wins += away_table.wins
            player_map[player].draws += home_table.draws
            player_map[player].loses += away_table.loses
            player_map[player].cleansheets += away_table.cleansheets

    return [result for result in player_map.values()]


class SetRoundData(BaseModel):
    teams: list[Team] = Field(default_factory=list)
    fixtures: list[Fixture] = Field(default_factory=list)
    table: list[IndividualTable]


class Set(BaseModel):
    season: str
    current_round: int
    round_data: list[SetRoundData]

    @classmethod
    def load(cls, path: pathlib.PurePath) -> "Set":
        with open(path) as f:
            data = json.load(f)
        return cls(**data)

    @classmethod
    def new_season(cls, season: str, path: pathlib.PurePath) -> "Set":
        print("Starting a new season! ...\n")

        players = input("Enter list of players seperated by space: ")
        players_list = players.split(" ")
        table = []

        for player in players_list:
            if player == "":
                continue
            data = IndividualTable()
            data.name = player
            table.append(data)
        round_data = [SetRoundData(table=table)]
        full_data = cls(season=season, current_round=0, round_data=round_data)
        with open(path / "seasons.json") as f:
            seasons = json.load(f)
            seasons.append(season)

        with open(path / "seasons.json", "w") as f:
            json.dump(seasons, f, indent=2)

        return full_data

    def update_fixtures(
        self,
        teams: list[Team] | None,
        fixtures: list[Fixture] | None,
        new_round: bool,
        path: pathlib.PurePath,
    ):
        print("Updating matchday Fixtures! ...\n")

        if teams is None and new_round:
            teams = input_teams()
        else:
            teams = self.round_data[self.current_round].teams
        team_map = Team.map_teams(teams)

        if fixtures is None:
            home = input("Enter the home team name: ")
            away = input("Enter the away team name: ")
            if home not in team_map:
                raise ValueError(f"Invalid team {home}")
            if away not in team_map:
                raise ValueError(f"Invalid team {away}")

            datetime = input(f"Enter the datetime in the format {DATETIME_FORMAT}: ")
            fixtures = [input_fixture(home=home, away=away, date=datetime)]

        if new_round:
            self.current_round += 1
            self.round_data.append(
                SetRoundData(teams=teams, fixtures=fixtures, table=[])
            )
        else:
            self.round_data[self.current_round].fixtures.extend(fixtures)
        save(self, path)

    def update_stats(
        self,
        path: pathlib.PurePath,
    ) -> None:
        current_round = self.current_round
        if current_round > 1:
            table = self.round_data[current_round - 1].table
            teams = self.round_data[current_round].teams
            fixtures = self.round_data[current_round].fixtures

            updated_table = apply_set_statistics(fixtures, table, teams)
            self.round_data[current_round].table = updated_table
            save(self, path)
        else:
            print("No Previous stats to update! ")

    def build(
        self, season: str, default_renderer: Renderer, season_renderer: Renderer
    ) -> None:
        # default_renderer = Renderer(template=pathlib.Path("templates/default.html"), output=pathlib.Path("index.html"))
        # season_renderer = Renderer(template=pathlib.Path("templates/season.html"), output=pathlib.Path(f"{season}.html"))

        # render the template

        current_round = self.current_round
        if current_round > 1:
            ...
        else:
            print("No Previous stats to build! ")


class MultipleLeagueKnockout(BaseModel):
    ...


# class Set:
#     def __init__(self, repository: SetRepository) -> None:
#         self.repo = repository

#     def start_new_season(self, season: str) -> None:
#         print("""
#         ``````````````````````````````````````

#         Starting a new season.

#         `````````````````````````````````````````
#         """)
#         players = input("Enter list of players seperated by space: ")
#         players_list = players.split(" ")
#         table = []

#         for player in players_list:
#             if player == "":
#                 continue
#             data = SetStatistics.empty_table()
#             data["name"] = player
#             table.append(data)
#         full_data = {
#             "players": players_list,
#             "current_round": 0,
#             "rounds": {"0": {"table": table}},
#         }
#         self.repo.write(season, full_data, new=True)

#     @staticmethod
#     def input_teams() -> dict[str, list[str]]:
#         num_teams = int(input("Enter number of teams: "))
#         teams = {}
#         for i in range(int(num_teams)):
#             team_name = input(f"Enter name of team {i + 1}: ")
#             team_name = f"{i + 1}" if team_name == "" else team_name
#             players = input(f"Enter players in team {team_name}, seperated by space: ")
#             teams[team_name] = players.split(" ")
#         return teams

#     @staticmethod
#     def input_fixtures(index: int, side: str) -> dict:
#         print("\n")
#         team: dict = {}
#         team_name = input(f"Enter the match {index} {side} team: ")
#         team["goals"] = []
#         team["team"] = team_name
#         team_goals = int(
#             input(f"Enter the number of goals scored by the {side} team: ")
#         )
#         for j in range(team_goals):
#             goal: dict[str, str | bool] = {}
#             scorer = input(f"goalscorer {j + 1}: ")
#             if scorer[:3].lower() == "og:":
#                 scorer = scorer[3:]
#                 goal["own_goal"] = True
#             goal["scorer"] = scorer
#             assist = input(f"assist provider {j + 1}: ")
#             if assist != "":
#                 goal["assist"] = assist
#             team["goals"].append(goal)

#         return team

#     def update_fixtures(
#         self,
#         season: str,
#         teams: dict[str, list[str]] | None,
#         new_round: bool,
#         result: list[dict] | None,
#         fixtures: list[Fixture],
#     ) -> None:
#         print("""
#         ``````````````````````````````````````

#         Adding Match Results.

#         `````````````````````````````````````````
#         """)
#         if teams is None:
#             teams = self.input_teams()

#         data = self.repo.read(season)
#         current_round = data["current_round"]
#         if new_round:
#             current_round += 1
#             data["current_round"] = current_round
#             data["rounds"][str(current_round)] = {
#                 "results": [],
#                 "table": [],
#                 "teams": teams,
#             }
#         date = input("Enter the date of the match: ")

#         if result is None:
#             result = []
#             num_result = input("Enter the number of results: ")
#             for i in range(int(num_result)):
#                 print("\n")
#                 home: dict = self.input_fixtures(i, "home")
#                 away: dict = self.input_fixtures(i, "away")
#                 result.append(
#                     {
#                         "home": home,
#                         "away": away,
#                         "date": date,
#                         "round": current_round,
#                         "stage": "",
#                     }
#                 )

#         data["rounds"][str(current_round)]["results"].append(result)
#         self.repo.write(season, data)

#     def update_stats(self, season: str, set_stats: SetStatistics) -> None:
#         print("""
#         ``````````````````````````````````````

#         Updating Player Statistics.

#         `````````````````````````````````````````
#         """)
#         data = self.repo.read(season)
#         current_round = data["current_round"]
#         table = deepcopy(data["rounds"][f"{current_round - 1}"]["table"])
#         table_map = {}
#         for item in table:
#             table_map[item["name"]] = item

#         teams = data["rounds"][f"{current_round}"]["teams"]
#         results = data["rounds"][f"{current_round}"]["results"]

#         table = set_stats.add_events(results, teams, table_map)
#         data["rounds"][f"{current_round}"]["table"] = table
#         self.repo.write(season, data)

#     def build(
#         self, season: str, default_renderer: Renderer, season_renderer: Renderer
#     ) -> None:
#         ...
#         # default_renderer = Renderer(template=pathlib.Path("templates/default.html"), output=pathlib.Path("index.html"))
#         # season_renderer = Renderer(template=pathlib.Path("templates/season.html"), output=pathlib.Path(f"{season}.html"))

#         # render the template
