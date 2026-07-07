import pathlib

from jinja2 import Template

if __name__ == "__main__":

    path = pathlib.PurePath(__file__).parent.parent
    with open(path / "templates" / "base_app.jinja") as t:
        raw_template = t.read()
    template = Template(raw_template)
    context = {"root": "./", "raw_season": "testing.com"}
    rendered = template.render(**context)

    with open(path / "frontend" / "app.html", "w", encoding="utf-8") as f:
        f.write(rendered)
