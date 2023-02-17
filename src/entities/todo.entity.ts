import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'todos' })
export class Todo {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column({ default: false })
  completed: boolean

}
