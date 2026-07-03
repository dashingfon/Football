import json
import pathlib
from dataclasses import dataclass
from copy import deepcopy

from jinja2 import Template

# @dataclass
class Goal:
    def __init__(self, scorer: str, assist: str | None, own_goal: bool = False) -> None:
        self.scorer = scorer
        self.assist = assist
        self.own_goal = own_goal

    @classmethod
    def from_dict(cls, data: dict) -> "Goal":
        return cls(
            scorer=data["scorer"],
            assist=data["assist"],
            own_goal=data.get("own_goal", False),
        )

    def json(self) -> dict:
        return {"scorer": self.scorer, "assist": self.assist, "own_goal": self.own_goal}


class Team:
    name: str
    players: list[str]


# @dataclass
class TeamGoals:
    def __init__(self, team: str, goals: list[Goal], penalty_goals: list[Goal]) -> None:
        self.team = team
        self.goals = goals
        self.penalty_goals = penalty_goals

    @classmethod
    def from_dict(cls, data: dict) -> "TeamGoals":
        return cls(
            team=data["team"],
            goals=[Goal.from_dict(goal_data) for goal_data in data["goals"]],
            penalty_goals=[Goal.from_dict(goal_data) for goal_data in data["penalty_goals"]],
        )

    def json(self) -> dict:
        return {
            "team": self.team,
            "goals": [goal.json() for goal in self.goals],
            "penalty_goals": [goal.json() for goal in self.penalty_goals],
        }


class Event:
    fixture: str
    name: str
    event: dict


# @dataclass
class Fixture:
    def __init__(
        self,
        date: str,
        game_round: str,
        events: list[Event],
        group: str,
        home: TeamGoals | None = None,
        away: TeamGoals | None = None,
    ) -> None:
        self.home = home
        self.away = away
        self.date = date
        self.round = game_round
        self.group = group
        self.events = events

    @classmethod
    def from_dict(cls, data: dict) -> "Fixture":
        return cls(
            date=data["date"],
            game_round=data["round"],
            group=data["group"],
            events=data.get("events", []),
            home=TeamGoals.from_dict(data["home"]) if data.get("home") else None,
            away=TeamGoals.from_dict(data["away"]) if data.get("away") else None,
        )

    def json(self) -> dict:
        return {
            "date": self.date,
            "round": self.round,
            "group": self.group,
            "home": self.home.json() if self.home else None,
            "away": self.away.json() if self.away else None,
            "events": self.events,
        }

    @classmethod
    def injest_events(cls, store, events: list[Event]):
        ...

    # def update_stats(self, player_stats, team_stats) -> dict:
    #     ...


class Renderer:
    def __init__(self, template: pathlib.PurePath, output: pathlib.PurePath) -> None:
        self.template = template
        self.output = output
        # add a pre processor?

    def render(self, data: dict) -> None:
        with open(self.template) as f:
            template = Template(f.read())
        rendered = template.render(**data)
        with open(self.output, "w") as f:
            f.write(rendered)


class LeagueKnockoutStatistics:
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

class SetStatistics:
    def __init__(self) -> None:
        pass

    def add_events(self, results: list[dict], teams: dict[str, list], table_map: dict) -> dict:
        team_stats = {}
        player_teams = {}

        for key, value in teams.items():
            team_stats[key] = {
                "pts": 0,
                "p": 0,
                "w": 0,
                "d": 0,
                "l": 0,
                "cleansheets": 0,
            }
            for player in value:
                player_teams[player] = key

        for result in results:
            ...

    @staticmethod
    def empty_table() -> dict:
        return {
            "name": "",
            "pts": 0,
            "p": 0,
            "w": 0,
            "d": 0,
            "l": 0,
            "goals": 0,
            "assists": 0,
            "g/a": 0,
            "cleansheets": 0,
        }


class LeaguesKnockoutStatistics:
    def __init__(self) -> None:
        pass

    def add_events(self, store, fixtures) -> dict: ...

    def empty_table(self) -> dict:
        return {
            "name": "",
            "pts": 0,
            "p": 0,
            "w": 0,
            "d": 0,
            "l": 0,
            "+/-": [0, 0],
            "gd": 0,
            "goals": 0,
            "cleansheets": 0,
        }


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
    def get_teams() -> dict[str, list[str]]:
        num_teams = int(input("Enter number of teams: "))
        teams = {}
        for i in range(int(num_teams)):
            team_name = input(f"Enter name of team {i + 1}: ")
            team_name = f"{i + 1}" if team_name == "" else team_name
            players = input(f"Enter players in team {team_name}, seperated by space: ")
            teams[team_name] = players.split(" ")
        return teams

    @staticmethod
    def get_result(index: int, side: str) -> dict:
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

    def update_result(
        self,
        season: str,
        teams: dict[str, list[str]] | None,
        new_round: bool,
        result: list[dict] | None,
    ) -> None:
        print("""
        ``````````````````````````````````````
              
        Adding Match Results.

        `````````````````````````````````````````
        """)
        if teams is None:
            teams = self.get_teams()

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
                home: dict = self.get_result(i, "home")
                away: dict = self.get_result(i, "away")
                result.append(
                    {
                        "home": home,
                        "away": away,
                        "date": date,
                        "round": current_round,
                        "group": "",
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


class League:
    # use the fixtures names to introduce knockout

    def __init__(self, store) -> None:
        self.repo = store

    def start_new_season(self, season: str, teams, fixtures) -> None:
        print("""
            ``````````````````````````````````````

            Starting a new season.

            `````````````````````````````````````````

            """)

    @staticmethod
    def get_events() -> dict[str, dict]: ...

    def update_events(self, season, fixture, events) -> None:
        print("""
            ``````````````````````````````````````

            Updating Fixtures Events.
            
            `````````````````````````````````````````

            """)
        
        # types of events
        # home goal, home assists, home red card, home yellow card, home sub
        # away goal, away assists, away red card, away yellow card, away sub
        # match winner{team name, title}
        # half time
        # full time
        # extra time half time
        # after extra time
        # penalty shootout
        # home penalty scored, home penalty missed
        # away penalty scored, away penalty missed
        # other match data; collect json lines?

        # main stats
        # - goals scored
        # - goals conceeded
        # - cleansheets
        # - redcards
        # - yellowcards

    def update_stats(self, season, stats) -> None:
        print("""
            ``````````````````````````````````````

            Updating Fixtures Statistics.

            `````````````````````````````````````````

            """)

    def build(self, renderer: Renderer, increment: bool = False) -> None:
        print("""
            ``````````````````````````````````````

            Build Static Files.

            `````````````````````````````````````````

            """)

