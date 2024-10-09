import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Expedient } from 'src/modules/expedients/entities/expedient.entity';
import { FIELD, PART_TYPES } from 'types';

@Entity('parts')
export class Part extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: FIELD.PART_NAME_MAX_LENGTH })
  name: string;

  @Column({
    type: 'enum',
    name: 'part_',
    enum: PART_TYPES,
    nullable: true
  })
  type: PART_TYPES;

  @ManyToOne(() => Expedient, (expedient) => expedient.parts)
  expedient: Expedient;
}