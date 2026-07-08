import pathlib

from jinja2 import Environment, FileSystemLoader

env = Environment(
    loader=FileSystemLoader("templates")
)

template = env.get_template("base_app.jinja")

if __name__ == "__main__":

    path = pathlib.PurePath(__file__).parent.parent
    # with open(path / "templates" / "base_app.jinja") as t:
    #     raw_template = t.read()
    # template = Template(raw_template)
    context = {"root": "./", "raw_season": "july_august_2026"}
    rendered = template.render(**context)

    with open(path / "frontend" / "app.html", "w", encoding="utf-8") as f:
        f.write(rendered)
