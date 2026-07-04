import json
import pathlib
from copy import deepcopy
from datetime import datetime

from pydantic import BaseModel
from jinja2 import Template


class Goal(BaseModel):
    scorer: str
    assist: str
    own_goal: bool = False


class Team(BaseModel):
    name: str
    players: list[str]


class Event(BaseModel):
    fixture: str
    name: str
    event: dict


class Fixture(BaseModel):
    home: str
    away: str
    date: datetime
    events: list[Event] | None = None

    # post init events_map


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
    goals_and_assists: int = 0
    cleansheets: int = 0
    red_cards: int = 0
    yellow_cards: int = 0


class TeamTable(BaseModel):
    team: str = ""
    points: int = 0
    played: int = 0
    wins: int = 0
    draws: int = 0
    losses: int = 0
    goals_scored: int = 0
    goals_conceded: int = 0
    goals_difference: int = 0
    cleansheets: int = 0
    red_cards: int = 0
    yellow_cards: int = 0


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
    players_stats: IndividualTable
    team_stats: TeamTable


class LeaguesData(BaseModel):
    current_round: int
    teams: dict[str, list[str]]
    fixtures: list[Fixture]
    titles: dict[str, str]
    round_data: dict[str, Leagues_RoundData]


class SetStatistics(BaseModel):
    def __init__(self) -> None:
        pass

    def apply_stats(self) -> IndividualTable:
        ...


class SetRoundData(BaseModel):
    teams: dict[str, list[str]]
    fixtures: list[Fixture]
    table: IndividualTable

class SetData(BaseModel):
    current_round: int
    round_data: dict[str, SetRoundData]

    @classmethod
    def from_path(path: pathlib.PurePath) -> "SetData":
        ...

    def save(self, season: str, path: pathlib.PurePath) -> None:
        ...


class SetRepository:
    def __init__(self, path: pathlib.PurePath) -> None:
        self.data_path = path

    def write(self, season: str, data: dict, new: bool = False):
        if new:
            with open(self.data_path / "seasons.json") as f:
                seasons = json.load(f)
                seasons.append(season)

            with open(self.data_path / "seasons.json", "w") as f:
                json.dump(seasons, f, indent=2)

        with open(self.data_path / f"{season}.json", "w") as f:
            json.dump(data, f, indent=2)

    def read(self, season: str) -> dict:
        with open(self.data_path / f"{season}.json") as f:
            data = json.load(f)
        return data
    
    def injest_events(self, fixtures: list[Fixture]) -> None:
        ...
        # verify the fixture exists
        # update the fixture with the new events


class Set:
    def __init__(self, repository: SetRepository) -> None:
        self.repo = repository

    def start_new_season(self, season: str) -> None:
        print("""
        ``````````````````````````````````````
              
        Starting a new season.

        `````````````````````````````````````````
        """)
        players = input("Enter list of players seperated by space: ")
        players_list = players.split(" ")
        table = []

        for player in players_list:
            if player == "":
                continue
            data = SetStatistics.empty_table()
            data["name"] = player
            table.append(data)
        full_data = {
            "players": players_list,
            "current_round": 0,
            "rounds": {"0": {"table": table}},
        }
        self.repo.write(season, full_data, new=True)

    @staticmethod
    def input_teams() -> dict[str, list[str]]:
        num_teams = int(input("Enter number of teams: "))
        teams = {}
        for i in range(int(num_teams)):
            team_name = input(f"Enter name of team {i + 1}: ")
            team_name = f"{i + 1}" if team_name == "" else team_name
            players = input(f"Enter players in team {team_name}, seperated by space: ")
            teams[team_name] = players.split(" ")
        return teams

    @staticmethod
    def input_fixtures(index: int, side: str) -> dict:
        print("\n")
        team: dict = {}
        team_name = input(f"Enter the match {index} {side} team: ")
        team["goals"] = []
        team["team"] = team_name
        team_goals = int(
            input(f"Enter the number of goals scored by the {side} team: ")
        )
        for j in range(team_goals):
            goal: dict[str, str | bool] = {}
            scorer = input(f"goalscorer {j + 1}: ")
            if scorer[:3].lower() == "og:":
                scorer = scorer[3:]
                goal["own_goal"] = True
            goal["scorer"] = scorer
            assist = input(f"assist provider {j + 1}: ")
            if assist != "":
                goal["assist"] = assist
            team["goals"].append(goal)

        return team

    def update_fixtures(
        self,
        season: str,
        teams: dict[str, list[str]] | None,
        new_round: bool,
        result: list[dict] | None,
        fixtures: list[Fixture]
    ) -> None:
        print("""
        ``````````````````````````````````````
              
        Adding Match Results.

        `````````````````````````````````````````
        """)
        if teams is None:
            teams = self.input_teams()

        data = self.repo.read(season)
        current_round = data["current_round"]
        if new_round:
            current_round += 1
            data["current_round"] = current_round
            data["rounds"][str(current_round)] = {
                "results": [],
                "table": [],
                "teams": teams,
            }
        date = input("Enter the date of the match: ")

        if result is None:
            result = []
            num_result = input("Enter the number of results: ")
            for i in range(int(num_result)):
                print("\n")
                home: dict = self.input_fixtures(i, "home")
                away: dict = self.input_fixtures(i, "away")
                result.append(
                    {
                        "home": home,
                        "away": away,
                        "date": date,
                        "round": current_round,
                        "stage": "",
                    }
                )

        data["rounds"][str(current_round)]["results"].append(result)
        self.repo.write(season, data)

    def update_stats(self, season: str, set_stats: SetStatistics) -> None:
        print("""
        ``````````````````````````````````````
        
        Updating Player Statistics.

        `````````````````````````````````````````
        """)
        data = self.repo.read(season)
        current_round = data["current_round"]
        table = deepcopy(data["rounds"][f"{current_round - 1}"]["table"])
        table_map = {}
        for item in table:
            table_map[item["name"]] = item

        teams = data["rounds"][f"{current_round}"]["teams"]
        results = data["rounds"][f"{current_round}"]["results"]

        table = set_stats.add_events(results, teams, table_map)
        data["rounds"][f"{current_round}"]["table"] = table
        self.repo.write(season, data)

    def build(
        self, season: str, default_renderer: Renderer, season_renderer: Renderer
    ) -> None:
        ...
        # default_renderer = Renderer(template=pathlib.Path("templates/default.html"), output=pathlib.Path("index.html"))
        # season_renderer = Renderer(template=pathlib.Path("templates/season.html"), output=pathlib.Path(f"{season}.html"))

        # render the template


class League_KnockoutStatistics(BaseModel):
    def __init__(self) -> None:
        pass

    def add_events(self, store, fixtures) -> dict: ...

    def empty_table(self) -> dict:
        return {
            "name": "",
            "goals": 0,
            "assists": 0,
            "g/a": 0,
            "cleansheets": 0,
            "redcards": 0,
            "yellowcards": 0,
        }


class Leagues_KnockoutStatistics(BaseModel):
    def __init__(self) -> None:
        pass

    def add_events(self, store, fixtures) -> dict: ...

    def empty_table(self) -> dict:
        return {
            "name": "",
            "points": 0,
            "p": 0,
            "w": 0,
            "d": 0,
            "l": 0,
            "+/-": [0, 0],
            "gd": 0,
            "goals": 0,
            "cleansheets": 0,
        }



class MultipleLeagueData(BaseModel):
    ...


class LeagueRepository:
    ...


class League(Set):
    ...

