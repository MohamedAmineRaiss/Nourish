import json
import pandas as pd
import csv
from io import StringIO

# load file
with open("foods.json", "r", encoding="utf-8") as f:
    data = json.load(f)

rows = []

for item in data:
    txt = item["row"].strip()

    # remove outer parentheses
    if txt.startswith("(") and txt.endswith(")"):
        txt = txt[1:-1]

    # parse CSV respecting quotes
    parsed = next(csv.reader(StringIO(txt), delimiter=',', quotechar='"'))

    rows.append(parsed)

# column names
cols = [
"id","label_en", "label_fr", "label_ar", "category", "category_fr", "category_ar", "variant", "calories", "protein", "fat", "carbs", "fiber", "iron", "zinc", "vitamin_c", "folate", "vitamin_b12"," selenium", "iodine", "synonyms"
]

df = pd.DataFrame(rows, columns=cols)

# save excel
df.to_excel("foods_clean.xlsx", index=False)
df.to_csv("foods_clean.csv", index=False, encoding="utf-8-sig")

print(df.head())
print("Saved foods_clean.xlsx")
