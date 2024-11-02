import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey } from "sequelize-typescript";

@Table
export class Row extends Model<Row> {
    @PrimaryKey
    @Column
    cell: string

    @Column
    value: string

    @Column
    sheet: string

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}