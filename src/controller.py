# check the results flow well

# to do it?
# 1. get the teams win, loss, draw and points
# 2. get goal scorers
# 3. get assists

import json
import pathlib
from copy import deepcopy
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


def get_result_data(season, end: bool):
    ...
    # if new season, get players
    # get teams
    # get results
    # write

def update_football_spot(teams, results, season, write: bool = False):

    PATH = pathlib.PurePath(__file__).parent.parent / "frontend" / "leagues" / "football_spot" / "seasons" / f"{season}.json"

    with open(PATH) as f:
        data = json.load(f)

    curr_round = data["current_round"]
    table = deepcopy(data["rounds"][f"{curr_round - 1}"]["table"])
    teams = data["rounds"][f"{curr_round}"]["teams"]
    results = data["rounds"][f"{curr_round}"]["results"]

    # teams and results will be passed in
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
        team_stats[f"{result[1]["team"]}"]["p"] += 1
        team_stats[f"{result[0]["team"]}"]["p"] += 1

        if result[0]["score"] == 0:
            team_stats[f"{result[1]["team"]}"]["cleansheets"] += 1
        if result[1]["score"] == 0:
            team_stats[f"{result[0]["team"]}"]["cleansheets"] += 1

        if result[0]["score"] > result[1]["score"]:
            team_stats[f"{result[0]["team"]}"]["pts"] += 3

            team_stats[f"{result[0]["team"]}"]["w"] += 1
            team_stats[f"{result[1]["team"]}"]["l"] += 1
        elif result[0]["score"] < result[1]["score"]:
            team_stats[f"{result[1]["team"]}"]["pts"] += 3

            team_stats[f"{result[1]["team"]}"]["w"] +=1
            team_stats[f"{result[0]["team"]}"]["l"] += 1
        else:
            team_stats[f"{result[1]["team"]}"]["pts"] += 1
            team_stats[f"{result[1]["team"]}"]["d"] += 1
            
            team_stats[f"{result[0]["team"]}"]["pts"] += 1
            team_stats[f"{result[0]["team"]}"]["d"] += 1

        for goals in result[0]["goals"]:
            if goals["scorer"] in table:
                table[goals["scorer"]]["goals"] += 1
                table[goals["scorer"]]["g/a"] += 1
            
            if ("assist" in goals) and (goals["assist"] in table):
                table[goals["assist"]]["assists"] += 1
                table[goals["assist"]]["g/a"] += 1
        
        for goals in result[1]["goals"]:
            if goals["scorer"] in table:
                table[goals["scorer"]]["goals"] += 1
                table[goals["scorer"]]["g/a"] += 1
            
            if ("assist" in goals) and (goals["assist"] in table):
                table[goals["assist"]]["assists"] += 1
                table[goals["assist"]]["g/a"] += 1

    for player, value in player_teams.items():
        table[player]["pts"] += team_stats[value]["pts"]
        table[player]["p"] += team_stats[value]["p"]
        table[player]["w"] += team_stats[value]["w"]
        table[player]["d"] += team_stats[value]["d"]
        table[player]["l"] += team_stats[value]["l"]
        table[player]["cleansheets"] += team_stats[value]["cleansheets"]

    if write:
        # write table to file
        with open(PATH, "w") as f:
            data["current_round"] = curr_round + 1
            data["rounds"][f"{curr_round + 1}"] = {}
            data["rounds"][f"{curr_round}"]["table"] = table
            json.dump(data, f, indent=2)
    else:
        print(table)


def test_football_spot(season):
    PATH = pathlib.PurePath(__file__).parent.parent / "frontend" / "leagues" / "football_spot" / "seasons" / f"{season}.json"

    with open(PATH) as f:
        data = json.load(f)
    
    players = data["players"]
    rounds = data["rounds"]

    for player in players:
        for r in rounds.values():
            if "table" not in r:
                continue

            assert len(players) == len(r['table'])
            # print(player)
            assert player in r["table"]
            assert "pts" in r["table"][player]
            assert "p" in r["table"][player]
            assert "w" in r["table"][player]
            assert "d" in r["table"][player]
            assert "l" in r["table"][player]
            assert "goals" in r["table"][player]
            assert "assists" in r["table"][player]
            assert "g/a" in r["table"][player]
            assert "cleansheets" in r["table"][player]

            if r["results"]:
                for game in r["results"]:
                    assert game[0]["score"] == len(game[0]["goals"])
                    assert game[1]["score"] == len(game[1]["goals"])


def fill_football_spot_result(season):
    ...
    # check players present
    # check results empty

    # get teams from user
    # get results from user


def start_football_spot(players, season):
    ...
    # add the teams and create the table


def main():
    # test_football_spot("february_2026")
    update_football_spot(0, 0, "february_2026", True)


if __name__ == "__main__":
    main()

