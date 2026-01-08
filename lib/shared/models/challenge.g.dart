// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'challenge.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class ChallengeAdapter extends TypeAdapter<Challenge> {
  @override
  final int typeId = 1;

  @override
  Challenge read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Challenge(
      id: fields[0] as String,
      title: fields[1] as String,
      description: fields[2] as String,
      type: fields[3] as ChallengeType,
      targetValue: fields[4] as int,
      currentValue: fields[5] as int,
      rewardPoints: fields[6] as int,
      startDate: fields[7] as DateTime,
      endDate: fields[8] as DateTime,
      isCompleted: fields[9] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, Challenge obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.type)
      ..writeByte(4)
      ..write(obj.targetValue)
      ..writeByte(5)
      ..write(obj.currentValue)
      ..writeByte(6)
      ..write(obj.rewardPoints)
      ..writeByte(7)
      ..write(obj.startDate)
      ..writeByte(8)
      ..write(obj.endDate)
      ..writeByte(9)
      ..write(obj.isCompleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChallengeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class ChallengeTypeAdapter extends TypeAdapter<ChallengeType> {
  @override
  final int typeId = 2;

  @override
  ChallengeType read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return ChallengeType.sessions;
      case 1:
        return ChallengeType.profit;
      case 2:
        return ChallengeType.hours;
      case 3:
        return ChallengeType.streak;
      case 4:
        return ChallengeType.venue;
      default:
        return ChallengeType.sessions;
    }
  }

  @override
  void write(BinaryWriter writer, ChallengeType obj) {
    switch (obj) {
      case ChallengeType.sessions:
        writer.writeByte(0);
        break;
      case ChallengeType.profit:
        writer.writeByte(1);
        break;
      case ChallengeType.hours:
        writer.writeByte(2);
        break;
      case ChallengeType.streak:
        writer.writeByte(3);
        break;
      case ChallengeType.venue:
        writer.writeByte(4);
        break;
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChallengeTypeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
