// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_stats.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class UserStatsAdapter extends TypeAdapter<UserStats> {
  @override
  final int typeId = 3;

  @override
  UserStats read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return UserStats(
      level: fields[1] as int,
      totalPoints: fields[2] as int,
      pendingPoints: fields[3] as int,
      monthlyPoints: fields[4] as int,
      totalSessions: fields[5] as int,
      totalMinutesPlayed: fields[6] as int,
      totalProfit: fields[7] as double,
      challengesCompleted: fields[8] as int,
    )..oddsName = fields[0] as String;
  }

  @override
  void write(BinaryWriter writer, UserStats obj) {
    writer
      ..writeByte(9)
      ..writeByte(0)
      ..write(obj.oddsName)
      ..writeByte(1)
      ..write(obj.level)
      ..writeByte(2)
      ..write(obj.totalPoints)
      ..writeByte(3)
      ..write(obj.pendingPoints)
      ..writeByte(4)
      ..write(obj.monthlyPoints)
      ..writeByte(5)
      ..write(obj.totalSessions)
      ..writeByte(6)
      ..write(obj.totalMinutesPlayed)
      ..writeByte(7)
      ..write(obj.totalProfit)
      ..writeByte(8)
      ..write(obj.challengesCompleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserStatsAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
