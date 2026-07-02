import pathlib
from typing import Protocol, TypedDict

from jinja2 import Template


class Goal:
    def __init__(self, scorer: str, assist: str) -> None:
        self.scorer = scorer
        self.assist = assist


class Result:
    def __init__(self, team: str, goals: list[Goal], events: dict[str, dict]) -> None:
        self.team = team
        self.goals = goals
        self.events = events


class Fixture:
    def __init__(self,date: str, game_round: str, group: str, home: Result | None = None, away: Result | None = None) -> None:
        self.home = home
        self.away = away
        self.date = date
        self.round = game_round
        self.group = group

    def update_stats(self, player_stats, team_stats) -> dict:
        ...


class PlayerStatistics:
    def __init__(self) -> None:
        pass

    def apply_stats(self, store, fixtures) -> dict:
        ...


class TeamStatistics:
    def __init__(self) -> None:
        pass

    def apply_stats(self, store, fixtures) -> dict:
        ...


class SetRepositoryProtocol(Protocol):
    ...


class SetRepository:
    ...


class Set:
    def __init__(self) -> None:
        pass

    def input_teams(self) -> None:
        ...
        # get the total number of teams
        # for each of the teams:
            # ask for players seperated by space

    def input_result(self) -> None:
        ...

    def update_round(self, player_stats, team_stats) -> None:
        ...
        # verify result!

    def build(self, renderer) -> None:
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

    def update_team_slot(self, team, slot: str) -> None:
        ...

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

    def build(self, renderer) -> None:
        ...
        # render the template
        # increment round


class LeagueKnockout:
    def __init__(self, teams: list | None, fixtures: list | None, store) -> None:
        pass

    def input_teams(self) -> None:
        ...
        # if teams is none!

    def update_team_slot(self, team, slot: str) -> None:
        ...

    def input_fixtures(self) -> None:
        ...
        # if fixtures is none!

    def input_result(self) -> None:
        ...
        # ask for slot?

    def update_round(self) -> None:
        ...
        # verify result!

    def build(self, renderer) -> None:
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

    def input_result(self) -> None:
        ...

    def update_round(self) -> None:
        ...
        # verify result!

    def build(self, renderer) -> None:
        ...
        # render the template
        # increment round

