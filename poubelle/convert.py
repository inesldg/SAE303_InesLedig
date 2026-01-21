import pandas as pd

xlsx = pd.ExcelFile("public-cinema.xlsx")

for sheet in xlsx.sheet_names:
    df = pd.read_excel(xlsx, sheet_name=sheet)
    df.to_csv(f"{sheet}.csv", index=False)
    print(f"Feuille '{sheet}' convertie → {sheet}.csv")
