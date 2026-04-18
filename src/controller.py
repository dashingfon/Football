
import json
import pathlib
from copy import deepcopy
from rich import print

from jinja2 import Template


def get_football_spot_result_data(season, new: bool = False, write: bool = False):
    PATH = pathlib.PurePath(__file__).parent.parent / "frontend" / "leagues" / "football_spot" / "seasons" / f"{season}.json"

    if new:
        players = input("Enter list of players seperated by space: ")
        players_list = players.split(" ")
        table = []
        for player in players_list:
            table.append({
                "name": player,
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
            )
        data = {"players": players_list, "current_round": 1, "rounds": {"0": {"table": table}}}

        with open(PATH.parent / "seasons.json") as f:
            seasons = json.load(f)
            seasons.append(season)

        with open(PATH.parent / "seasons.json", "w") as f:
            json.dump(seasons, f, indent=2)

        with open(PATH, "w") as f:
            json.dump(data, f, indent=2)

        # update the default page
        
        return

    num_teams = input("number of teams: ")
    teams = {}
    for i in range(int(num_teams)):
        members = input(f"players in team {i + 1} : ")
        teams[f"{i + 1}"] = members.split(" ")

    result = []
    num_result = input("number of results: ")
    for i in range(int(num_result)):
        print("\n")

        home = input(f"match {i + 1} home team: ")
        home_goals = input("number of goals scored by the home team: ")
        home_result = {
            "team": int(home),
            "score": int(home_goals),
            "goals": []
        }

        for j in range(int(home_goals)):
            scorer = input(f"goalscorer {j + 1}: ")
            assist = input(f"assist provider {j + 1}: ")
            home_result["goals"].append({
                "scorer": scorer,
                "assist": assist
            })

        
        away = input(f"match {i + 1} away team: ")
        away_goals = input("number of goals scored by the away team: ")
        away_result = {
            "team": int(away),
            "score": int(away_goals),
            "goals": []
        }

        for j in range(int(away_goals)):
            scorer = input(f"goalscorer {j + 1}: ")
            assist = input(f"assist provider {j + 1}: ")
            away_result["goals"].append({
                "scorer": scorer,
                "assist": assist
            })

        result.append([home_result, away_result])

    with open(PATH) as f:
        data = json.load(f)
        curr_round = data["current_round"]

    if write:
        with open(PATH, "w") as f:
            data["current_round"] = curr_round + 1
            data["rounds"][f"{curr_round + 1}"] = {}
            data["rounds"][f"{curr_round + 1}"]["teams"] = teams
            data["rounds"][f"{curr_round + 1}"]["results"] = result
            json.dump(data, f, indent=2)
    else:
        print(teams)
        print(result)


def update_football_spot(season, write: bool = False):

    PATH = pathlib.PurePath(__file__).parent.parent / "frontend" / "leagues" / "football_spot" / "seasons" / f"{season}.json"

    with open(PATH) as f:
        data = json.load(f)

    curr_round = data["current_round"]
    table = deepcopy(data["rounds"][f"{curr_round - 1}"]["table"])
    table_map = {}
    for item in table:
        table_map[item["name"]] = item

    teams = data["rounds"][f"{curr_round}"]["teams"]
    results = data["rounds"][f"{curr_round}"]["results"]

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
            if goals["scorer"] in table_map:
                table_map[goals["scorer"]]["goals"] += 1
                table_map[goals["scorer"]]["g/a"] += 1
            
            if ("assist" in goals) and (goals["assist"] in table_map):
                table_map[goals["assist"]]["assists"] += 1
                table_map[goals["assist"]]["g/a"] += 1
        
        for goals in result[1]["goals"]:
            if goals["scorer"] in table_map:
                table_map[goals["scorer"]]["goals"] += 1
                table_map[goals["scorer"]]["g/a"] += 1
            
            if ("assist" in goals) and (goals["assist"] in table_map):
                table_map[goals["assist"]]["assists"] += 1
                table_map[goals["assist"]]["g/a"] += 1

    for player, value in player_teams.items():
        table_map[player]["pts"] += team_stats[value]["pts"]
        table_map[player]["p"] += team_stats[value]["p"]
        table_map[player]["w"] += team_stats[value]["w"]
        table_map[player]["d"] += team_stats[value]["d"]
        table_map[player]["l"] += team_stats[value]["l"]
        table_map[player]["cleansheets"] += team_stats[value]["cleansheets"]

    sorted_table = list(
        sorted(list(table_map.values()), key=lambda item: (item["pts"], item["p"], item["w"]), reverse=True)
    )

    if write:
        with open(PATH, "w") as f:
            data["rounds"][f"{curr_round}"]["table"] = sorted_table
            json.dump(data, f, indent=2)

        # get season html
        # write to season
        # write to index

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


def main():
    ...
    # get_football_spot_result_data("april_2026", write = True)
    # update_football_spot("april_2026", True)


if __name__ == "__main__":
    main()

