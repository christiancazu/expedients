import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Expedient } from '../../expedients/entities/expedient.entity'
import { FIELD, PART_TYPES } from '@expedients/shared'

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: FIELD.PART_NAME_MAX_LENGTH })
  name: string

  @Column({
    type: 'enum',
    name: 'type',
    enumName: 'type',
    enum: PART_TYPES,
    nullable: true
  })
  type: PART_TYPES

  @ManyToOne(() => Expedient, (expedient) => expedient.parts)
  expedient: Expedient
}
