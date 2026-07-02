import json
import pathlib

# from typing import Protocol, TypedDict

from jinja2 import Template


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


class Result:
    def __init__(self, team: str, goals: list[Goal], events: dict[str, dict]) -> None:
        self.team = team
        self.goals = goals
        self.events = events

    @classmethod
    def from_dict(cls, data: dict) -> "Result":
        return cls(
            team=data["team"],
            goals=[Goal.from_dict(goal_data) for goal_data in data["goals"]],
            events=data["events"],
        )

    def json(self) -> dict:
        return {
            "team": self.team,
            "goals": [goal.json() for goal in self.goals],
            "events": self.events,
        }


class Fixture:
    def __init__(
        self,
        date: str,
        game_round: str,
        group: str,
        home: Result | None = None,
        away: Result | None = None,
    ) -> None:
        self.home = home
        self.away = away
        self.date = date
        self.round = game_round
        self.group = group

    @classmethod
    def from_dict(cls, data: dict) -> "Fixture":
        return cls(
            date=data["date"],
            game_round=data["round"],
            group=data["group"],
            home=Result.from_dict(data["home"]) if data.get("home") else None,
            away=Result.from_dict(data["away"]) if data.get("away") else None,
        )

    def json(self) -> dict:
        return {
            "date": self.date,
            "round": self.round,
            "group": self.group,
            "home": self.home.json() if self.home else None,
            "away": self.away.json() if self.away else None,
        }

    # def update_stats(self, player_stats, team_stats) -> dict:
    #     ...


class PlayerStatistics:
    def __init__(self) -> None:
        pass

    def apply_stats(self, store, fixtures) -> dict: ...

    def empty_json(self) -> dict:
        return {
            "name": "",
            "goals": 0,
            "assists": 0,
            "g/a": 0,
            "cleansheets": 0,
            "redcards": 0,
            "yellowcards": 0,
        }


class IndividualPlayerStatistics:
    def __init__(self) -> None:
        pass

    def apply_stats(self, store, fixtures, teams) -> dict: ...

    @staticmethod
    def empty_json() -> dict:
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


class TeamStatistics:
    def __init__(self) -> None:
        pass

    def apply_stats(self, store, fixtures) -> dict: ...

    def empty_json(self) -> dict:
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

    def write(self, season: str, data: dict, new: bool):
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
        players = input("Enter list of players seperated by space: ")
        players_list = players.split(" ")
        table = []

        for player in players_list:
            if player == "":
                continue
            data = IndividualPlayerStatistics.empty_json()
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
        self, season: str, teams: dict[str, list[str]] | None, new_round: bool, result: list[dict] | None
    ) -> None:
        if teams is None:
            teams = self.get_teams()

        data = self.repo.read(season)
        current_round = data["current_round"]
        if new_round:
            current_round += 1
            data["current_round"] = current_round
            data["rounds"][str(current_round)] = {"results": [], "table": [], "teams": teams}
        date = input("Enter the date of the match: ")

        if result is None:
            result = []
            num_result = input("Enter the number of results: ")
            for i in range(int(num_result)):
                print("\n")
                home: dict = self.get_result(i, "home")
                away: dict = self.get_result(i, "away")
                result.append({"home": home, "away": away, "date": date, "round": current_round, "group": ""})

        data["rounds"][str(current_round)]["results"].append(result)
        self.repo.write(season, data, new=True)

    def update_stats(self, player_stats, team_stats) -> None:
        ...
        # verify result!

    def build(self, renderer, increment: bool = False) -> None:
        ...
        # render the template
        # increment round


class MultipleLeagueKnockout:
    def __init__(self, teams: list | None, fixtures: list | None, store) -> None:
        pass
        # if home on fixture is not in teams add to slot

    def input_teams(self) -> None:
        ...
        # if teams is none!

    def update_team_slot(self, team, slot: str) -> None: ...

    def input_fixtures(self) -> None:
        ...
        # if fixtures is none!

    def input_result(self) -> None:
        ...
        # ask for slot?
        # check the fixture matches self.fixtures

    def update_round(self) -> None:
        ...
        # verify result!

    def build(self, renderer, increment: bool = False) -> None:
        ...
        # render the template
        # increment round


class LeagueKnockout:
    def __init__(self, teams: list | None, fixtures: list | None, store) -> None:
        pass

    def input_teams(self) -> None:
        ...
        # if teams is none!

    def update_team_slot(self, team, slot: str) -> None: ...

    def input_fixtures(self) -> None:
        ...
        # if fixtures is none!

    def input_result(self) -> None:
        ...
        # ask for slot?

    def update_round(self) -> None:
        ...
        # verify result!

    def build(self, renderer, increment: bool = False) -> None:
        ...
        # render the template
        # increment round


class League:
    def __init__(self, store) -> None:
        pass

    def input_teams(self) -> None:
        ...
        # if teams is none!

    def input_fixtures(self) -> None:
        ...
        # if fixtures is none!

    def input_result(self) -> None: ...

    def update_round(self) -> None:
        ...
        # verify result!

    def build(self, renderer, increment: bool = False) -> None:
        ...
        # render the template
        # increment round
