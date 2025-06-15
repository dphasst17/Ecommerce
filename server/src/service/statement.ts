import type { CreateTableBuilder } from "kysely";
import { db } from "models/connect";
interface ValueType {
  nameCol: string;
  value: string | number;
}
export interface ConditionType {
  conditionName: string;
  conditionMethod: "=" | "!=" | ">=" | "<=" | "like" | "not like" | "in" | "not in";
  value: string | number | number[] | string[];
}
export interface columnAddType {
  name: string,
  datatypes: DataTypes,
  limit: number
}
type columnDelType = string[]
type DataTypes = "varchar" | "integer" | "date"
export default class Statements {
  //insert data
  public insertData = async (table: string, data: ValueType[]) => {
    const result = data.map((c) => `${c.nameCol}:${typeof c.value === "string" ? `"${c.value}"` : c.value}`).toString();
    return await db
      .insertInto(table)
      .values(eval(`({${result}})`))
      .executeTakeFirst();
  };
  //insert multi data
  public insertDataMulti = async (table: string, data: { [x: string]: string | number }[]) => {
    return await db.insertInto(table).values(data).execute();
  };

  //insert data with select from table
  public insertSubQuery = async (
    tableInsert: string,
    colInsert: string[],
    tableSelect: string,
    colSelect: any[],
    condition: ConditionType,
    join?: {
      table: string,
      key1: string,
      key2: string,
      type: string
    }[],
  ) => {
    return await db
      .insertInto(tableInsert)
      .columns(colInsert)
      .expression((eb: any) => {
        let query: any = eb.selectFrom(tableSelect).select(colSelect);
        join && join.map((j: any) => (query = query[j.type](j.table, j.key1, j.key2)));
        return query.where(condition.conditionName, condition.conditionMethod, condition.value);
      })
      .execute();
  };

  public updateDataByCondition = async (table: string, data: ValueType[], condition: ConditionType) => {
    const result = data.map((c) => `${c.nameCol}:${typeof c.value === "string" ? `'${c.value}'` : c.value}`).toString();
    return await db
      .updateTable(table)
      .set(eval(`({${result}})`))
      .where(condition.conditionName, condition.conditionMethod, condition.value)
      .executeTakeFirst();
  };
  public removeData = async (table: string, condition: ConditionType) => {
    return await db
      .deleteFrom(table)
      .where(condition.conditionName, condition.conditionMethod, condition.value)
      .executeTakeFirst();
  };
  public createIndex = async (indexName: string, table: string, column: string[]) => {
    return await db.schema.createIndex(indexName)
      .on(table)
      .columns(column)
      .execute()
  }
  public dropIndex = async (indexName: string) => {
    return await db.schema.dropIndex(indexName)
      .execute()
  }
  //this is code sql for create table or drop table detail product
  public table = async (method: "add" | "remove", table: string, column?: columnAddType[]) => {
    let query = db.schema.createTable(table)
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('idProduct', 'integer', col => col.notNull());

    column && column.map((d: columnAddType) => (
      query = query.addColumn(d.name, d.datatypes === "varchar" ? `varchar(${d.limit})` : d.datatypes, col => col.notNull())
    ))
    return method === "remove" ? await db.schema.dropTable(table).execute()
      : await query.addForeignKeyConstraint(`${table}`, ['idProduct'], 'products', ['idProduct']).execute()
  };
  //update table : add column or drop column
  public columnChange = async (method: "add" | "remove", table: string, column: columnAddType[] | string) => {
    try {
      let query: any = db.schema.alterTable(table)
      typeof (column) !== "string" && column.map((d: columnAddType) =>
        query = query.addColumn(d.name, d.datatypes === "varchar" ? `varchar(${d.limit})` : d.datatypes, (col: any) => col.notNull())
      )
      return method === "remove" && typeof (column) === "string" ? await query.dropColumn(column).execute() :
        query && await query.execute()
    }
    catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };
}
