import pandas as pd
from datetime import datetime,date
import json
import sys
import os, time

filename = sys.argv[1]
excelname = filename
response = {'status': None, 'errors': []}

try:
    print(excelname)
    xls = pd.ExcelFile(excelname)
except:
    response['status'] = 'failure'
    response['errors'].append('הקובץ לא קיים')
    print(response)
    sys.exit()

list_of_sheets = xls.sheet_names
writer = pd.ExcelWriter(os.path.join('Exceloutput', excelname))

file_path = os.path.join('Exceloutput', f'{filename}.txt')

print(file_path)
def checkIfFileExists():
    infoData = format(datetime.now().strftime("%Y-%m-%d %H:%M"))
    if os.path.exists(file_path):
        with open(file_path, "a", encoding='utf-8') as infoWrite:
            json.dump(infoData, infoWrite, ensure_ascii=False)
            infoWrite.write("\n")
    else:
        with open(file_path, "w", encoding='utf-8') as infoWrite:
            json.dump(infoData, infoWrite, ensure_ascii=False)
            infoWrite.write("\n")
    infoWrite.close()

def writeToJson(text):
    with open(file_path, "a", encoding='utf-8') as infoWrite:
        infoWrite.write(json.dumps(text, ensure_ascii=False, indent=2))
        infoWrite.write("\n")
        infoWrite.close()
    # with open(json_path, "r", encoding='utf-8') as infoRead:
    # infoData = json.loads(infoRead.read())
    # infoData.append(text)

def exportExcel(df, nameSheet):
    df = df.fillna("0")
    try:
        df.to_excel(writer, sheet_name=nameSheet, header=None)
    except:
        response['status'] = 'failure'
        response['errors'].append('שם הגיליון ארוך יותר מ-31 תווים')
        writeToJson("שם הגיליון ארוך יותר מ-31 תווים " + nameSheet)


def changeColomnsName(dataframe, string):
    newColName = "תקופה"
    for colName in dataframe.columns:
        if str(colName).find(string) != -1:
            dataframe.rename(columns={colName: newColName}, inplace=True)
        else:
            newColName = colName
    return dataframe

def dropNan(dataframe):
    dataframe.dropna(how='all', inplace=True)
    return dataframe

def changeRowNameNull(dataframe):
    newColName = " "
    for i in range(0, len(dataframe.columns)):
        if pd.isnull(dataframe.iloc[0, i]):
            dataframe.iloc[0, i] = newColName
        else:
            newColName = dataframe.iloc[0, i]
    return dataframe


def addTheFirstrowToTheColomns(dataframe):
    for i in range(0, len(dataframe.columns)):
        if not pd.isnull(dataframe.iloc[0, i]):
            dataframe.columns.values[i] = str(dataframe.columns.values[i]) + "-" + changeColType(dataframe.iloc[0, i])
    return dataframe


def changeColType(nameCol):
    if type(nameCol) == str or isinstance(nameCol, date):
        return str(nameCol)
    if pd.isnull(nameCol):
        return nameCol

    return str(int(nameCol))


def addColumnsAndTranspose(dataframe, sheetname):
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    dataframe = dropNan(dataframe)
    dataframe = dataframe.transpose()
    exportExcel(dataframe, sheetname)


def droprow(dataframe, numberOfRow):
    dataframe = dataframe.drop(dataframe.index[numberOfRow])
    return dataframe


def onlyTranspose(dataframe, sheetname):
    dataframe.columns.values[0] = "תקופה"
    dataframe = dropNan(dataframe)
    dataframe = dataframe.transpose()
    exportExcel(dataframe, sheetname)


def moreThanOneTableOnlyTranspose(df, name_sheet):
    df = droprowsfnan(df)
    nameofsheets = findNumsOfTable(df)
    count = 0
    name_list = 0
    for i in range(len(df)):
        if str(df.iloc[i, 0]).find("#") != -1 and count != 0 or i == len(df) - 1:
            if i - count != 0:
                new_table = df[i + 1 - count:i]
                for j in range(0, len(new_table.columns)):
                    new_table.columns.values[j] = changeColType(new_table.iloc[0, j])
                new_table = droprow(new_table, 0)
            else:
                new_table = df[i - count:i]
                new_table = changeColomnsName(new_table, ':')
                new_table.columns = new_table.columns.astype(str)
            count = 1
            new_table = new_table.dropna(how='all', axis=1)
            new_table = new_table.transpose()
            exportExcel(new_table, name_sheet + "-" + nameofsheets[name_list])
            name_list = name_list + 1
        else:
            count = count + 1

def removeQuotationMarks(excel_name, name_sheet):
    name_sheet = name_sheet.replace('"', "")
    return pd.ExcelWriter(name_sheet+" "+excel_name)

def droprowsfnan(dataframe):
    dataframe = dataframe.dropna(how='all')
    return dataframe



def findNamesInDf(dataframe, j):
    list_of_tables = []
    for i in range(0, len(dataframe)):
        if not pd.isnull(dataframe.iloc[i, j]):
            list_of_tables.append(dataframe.iloc[i, j])
    return list_of_tables


def findNumsOfTable(dataframe):
    nameoftables = [dataframe.columns.values[0]]
    for i in range(len(dataframe)):
        if str(dataframe.iloc[i, 0]).find("#") != -1:
            nameoftables.append(dataframe.iloc[i + 1, 0])
    return nameoftables


def addStringsRow(df, list_of_tables, k, flag):
    list_of_rows = []
    name_list = 0
    count = 0
    sizeListTables=len(list_of_tables)
    for i in range(len(df)):
        if str(df.iloc[i, k]).find("@") != -1 and count != 0 or i == len(df) - 1:
            for j in range(i - count, i):
                if pd.isnull(df.iloc[j, k + 1]) and j == i - count:
                    list_of_rows.append(str(list_of_tables[name_list]))
                    df.iloc[j, k + 1] = str(list_of_tables[name_list])
                elif not pd.isnull(df.iloc[j, k + 1]):
                    list_of_rows.append(str(list_of_tables[name_list]) + "-" + str(df.iloc[j, k + 1]))
                    df.iloc[j, k + 1] = str(list_of_tables[name_list]) + "-" + str(df.iloc[j, k + 1])
            if sizeListTables-1 > name_list:
                 name_list = name_list + 1
            if i == len(df) - 1 and flag:
                if pd.isnull(df.iloc[len(df) - 1, k + 1]):
                    list_of_rows.append(str(list_of_tables[name_list]))
                    df.iloc[len(df) - 1, k + 1] = str(list_of_tables[name_list])
                elif not pd.isnull(df.iloc[len(df) - 1, k + 1]):
                    list_of_rows.append(str(list_of_tables[name_list]) + "-" + str(df.iloc[len(df) - 1, k + 1]))
                    df.iloc[len(df) - 1, k + 1] = str(list_of_tables[name_list]) + "-" + str(
                        df.iloc[len(df) - 1, k + 1])

            count = 1
        else:
            count = count + 1
    return df, list_of_rows


def moreThanOneTable(df, name_sheet):
    df = droprowsfnan(df)
    nameofsheets = findNumsOfTable(df)
    count = 0
    name_list = 0
    for i in range(len(df)):
        if str(df.iloc[i, 0]).find("#") != -1 and count != 0 or i == len(df) - 1:
            if i - count != 0:
                new_table = df[i + 1 - count:i]
                new_table = changeRowNameNull(new_table)
                for j in range(0, len(new_table.columns)):
                    new_table.columns.values[j] = changeColType(new_table.iloc[0, j])
                new_table = droprow(new_table, 0)
            else:
                new_table = df[i - count:i]
                new_table = changeColomnsName(new_table, ':')
                new_table.columns = new_table.columns.astype(str)
            new_table = addTheFirstrowToTheColomns(new_table)
            count = 1
            new_table = new_table.dropna(how='all', axis=1)
            new_table = new_table.drop(new_table.index[0])
            new_table = new_table.transpose()
            exportExcel(new_table, name_sheet + "-" + nameofsheets[name_list])
            name_list = name_list + 1
        else:
            count = count + 1


def twoColumnsCut(dataframe, name_sheet):
    dataframe = droprowsfnan(dataframe)
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    nameoftables = findNamesInDf(dataframe, 0)
    dataframe = dataframe.iloc[:, 1:]
    cutToTables(dataframe, 0, nameoftables, name_sheet)


def twoColomnsAddString(dataframe, name_sheet):
    dataframe = droprowsfnan(dataframe)
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    nameofColumns = findNamesInDf(dataframe, 0)
    new_table, nameofColumns = addStringsRow(dataframe, nameofColumns, 1, 1)
    new_table = new_table.iloc[:, 2:]
    new_table = dropNan(new_table)
    new_table = new_table.transpose()
    exportExcel(new_table, name_sheet)


def threeColomnsCuttwoColomns(dataframe, name_sheet):
    dataframe = droprowsfnan(dataframe)
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    nameOfTables = findNamesInDf(dataframe, 0)
    new_table, nameOfTables = addStringsRow(dataframe, nameOfTables, 1, 0)
    new_table = new_table.iloc[:, 3:]
    cutToTables(new_table, 0, nameOfTables, name_sheet)


def OnlychangeColomnsName(dataframe, sheetname):
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    dataframe = dropNan(dataframe)
    dataframe = dataframe.fillna("0")
    try:
        dataframe.to_excel(writer, sheet_name=sheetname, index=False)
    except:
        response['status'] = 'failure'
        response['errors'].append('שם הגיליון ארוך יותר מ-31 תווים')
        writeToJson("שם הגיליון ארוך יותר מ-31 תווים " + sheetname)



def cutToTables(dataframe, k, nameOfTables, nameSheet):
    j = 0
    count = 0
    for i in range(len(dataframe)):
        if str(dataframe.iloc[i, k]).find("&") != -1 and count != 0 or i == len(dataframe) - 1:
            if i == len(dataframe) - 1:
                new_table = dataframe[i - count:i + 1]
            else:
                new_table = dataframe[i - count:i]
            new_table = new_table.iloc[:, 1:]
            new_table = dropNan(new_table)
            new_table = new_table.transpose()
            new_table = new_table.fillna("0")
            exportExcel(new_table, nameSheet + "-" + nameOfTables[j])
            count = 1
            j = j + 1
        else:
            count = count + 1



def threeColumnsAddString(dataframe, name_sheet):
    dataframe = droprowsfnan(dataframe)
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    nameofColumns = findNamesInDf(dataframe, 0)
    new_table = dataframe.iloc[:, 1:]
    new_table, nameofColumn = addStringsRow(new_table, nameofColumns, 0, 1)
    new_table, nameofColumns = addStringsRow(dataframe, nameofColumn, 3, 1)
    new_table = new_table.iloc[:, 4:]
    new_table = dropNan(new_table)
    new_table = new_table.transpose()
    new_table = new_table.fillna("0")
    exportExcel(new_table, name_sheet)

def Maazan(dataframe, name_sheet):
    dataframe = droprowsfnan(dataframe)
    dataframe = changeColomnsName(dataframe, ':')
    dataframe = addTheFirstrowToTheColomns(dataframe)
    dataframe = droprow(dataframe, 0)
    nameofSheets = findNamesInDf(dataframe, 0)
    count = 0
    j = 0
    for i in range(0, len(dataframe)):
        if (str(dataframe.iloc[i, 1]).find("&") != -1 and count != 0) or (i == len(dataframe) - 1):
            if i == len(dataframe) - 1:
                new_table = dataframe[i - count:i + 1]
            else:
                new_table = dataframe[i - count:i]
            namesofrows = findNamesInDf(new_table, 2)
            new_table, list_of_names = addStringsRow(new_table, namesofrows, 3, 1)
            new_table, list_of_names = addStringsRow(new_table, list_of_names, 5, 1)
            new_table = new_table.iloc[:, 6:]
            new_table = dropNan(new_table)
            new_table = new_table.transpose()
            exportExcel(new_table, name_sheet + "-" + nameofSheets[j])
            j = j + 1
            count = 1
        else:
            count = count + 1


def readSheets(list_of_sheets, excel_name):
    checkIfFileExists()
    for i in range(0, len(list_of_sheets)):
        if list_of_sheets[i].find('T') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('T', "")
            onlyTranspose(dataframe, sheetname)
        elif list_of_sheets[i].find('+') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('+', "")
            addColumnsAndTranspose(dataframe, sheetname)
        elif list_of_sheets[i].find('!') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('!', "")
            moreThanOneTableOnlyTranspose(dataframe, sheetname)
        elif list_of_sheets[i].find('A') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('A', "")
            OnlychangeColomnsName(dataframe, sheetname)
        elif list_of_sheets[i].find('b') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('b', "")
            twoColumnsCut(dataframe, sheetname)
        elif list_of_sheets[i].find('c') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('c', "")
            twoColomnsAddString(dataframe, sheetname)
        elif list_of_sheets[i].find('d') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('d', "")
            threeColomnsCuttwoColomns(dataframe, sheetname)
        elif list_of_sheets[i].find('e') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('e', "")
            threeColumnsAddString(dataframe, sheetname)
        elif list_of_sheets[i].find('M') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('M', "")
            Maazan(dataframe, sheetname)
        elif list_of_sheets[i].find('U') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('U', "")
            moreThanOneTable(dataframe, sheetname)
        elif list_of_sheets[i].find('N') != -1:
            dataframe = pd.read_excel(excel_name, sheet_name=list_of_sheets[i])
            sheetname = list_of_sheets[i].replace('N', "")
            dataframe = dataframe.fillna("0")
            try:
                dataframe.to_excel(writer, sheet_name=sheetname, index=False)
            except:
                response['status'] = 'failure'
                response['errors'].append('שם הגיליון ארוך יותר מ-31 תווים')
                writeToJson("שם הגיליון ארוך יותר מ-31 תווים " + sheetname)

        else:
            response['status'] = 'failure'
            response['errors'].append("בגיליון" + "-" + list_of_sheets[i] + " לא קיים/צוין פורמט תקין")
            writeToJson("בגיליון" + "-" + list_of_sheets[i] + " לא קיים/צוין פורמט תקין")


readSheets(list_of_sheets, excelname)
writer.save()

with open(file_path, "r", encoding="utf-8") as infoRead:
    fileData = infoRead.read()
    flag = fileData.split()
    infoRead.close()

dateInFile = flag[len(flag)-2].replace('"', "")

try:
    time.strptime(dateInFile, '%Y-%m-%d')
    writeToJson("Success")
    # print(json.dumps("Success", ensure_ascii=False))
    response['status'] = 'success'
    print(response)
except:
    writeToJson("Error")
    response['status'] = 'failure'
    # print(json.dumps("Error", ensure_ascii=False))
    print(response)


