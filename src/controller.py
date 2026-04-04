# check the results flow well

# to do it?
# 1. get the teams win, loss, draw and points
# 2. get goal scorers
# 3. get assists

import json
import pathlib
from rich import print


def calculate(match_day: int = 1, month: str = "march"):
    """
    calculates the points, goals and assists table for me,
    the teams must be added before this function is called
    the results of the matchday must be added before running this function
    """
    PATH = pathlib.PurePath(__file__).parent / "data" / f"{month}.json"

    with open(PATH) as f:
        data = json.load(f)

    # get the table
    if match_day == 1:
        table = data[month]["players"]
    else:
        table = data[month][f"{match_day - 1}"]["table"]

    # get the matchday results
    results = data[month][f"{match_day}"]["results"]
    teams = data[month][f"{match_day}"]["teams"]

    # map each player to their team
    for team in teams:
        ...
    
    # perform the calculations
    for result in results:
        team_data = {}
        player_to_teams = {}

    # save table
    data[month][f"{match_day}"]["table"] = table
    with open(PATH, "w") as f:
        json.dump(f, data)


def update_Football_spot():
    ...


if __name__ == "__main__":
    calculate()
