import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Expedient } from 'src/modules/expedients/entities/expedient.entity';
import { PART_TYPES } from '../interfaces';

@Entity('parts')
export class Part extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column('enum', {
    enum: PART_TYPES
  })
  type: PART_TYPES;

  @ManyToOne(() => Expedient, (expedient) => expedient.parts)
  expedient: Expedient;
}
