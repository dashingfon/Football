import pathlib
from typing import Protocol, TypedDict

from jinja2 import Template


class Goal:
    scorer: str
    assist: str


class Result:
    team: str
    goals: list[Goal]
    events: dict[str, dict]


class Fixture:
    home: Result | None
    away: Result | None
    date: str  # use datetime?
    game_round: str
    group: str

    def update_stats(self, player_stats, team_stats) -> dict:
        ...


class PlayerStatistics:
    ...


class TeamStatistics:
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

