import pathlib

from jinja2 import Environment, FileSystemLoader

env = Environment(
    loader=FileSystemLoader("templates")
)

template = env.get_template("v2-league.jinja")
stats_template = env.get_template("v2-league-stats.jinja")

if __name__ == "__main__":

    path = pathlib.PurePath(__file__).parent.parent
    context = {"root": "./", "raw_season": "july_august_2026"}
    rendered = template.render(**context)

    with open(path / "frontend" / "app.html", "w", encoding="utf-8") as f:
        f.write(rendered)
    
    context = {"root": "./", "raw_season": "july_august_2026"}
    rendered = stats_template.render(**context)

    with open(path / "frontend" / "stats.html", "w", encoding="utf-8") as f:
        f.write(rendered)
