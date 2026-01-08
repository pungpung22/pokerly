// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'session.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class SessionAdapter extends TypeAdapter<Session> {
  @override
  final int typeId = 0;

  @override
  Session read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Session(
      id: fields[0] as String,
      date: fields[1] as DateTime,
      venue: fields[2] as String,
      gameType: fields[3] as String,
      stakes: fields[4] as String,
      durationMinutes: fields[5] as int,
      buyIn: fields[6] as double,
      cashOut: fields[7] as double,
      notes: fields[8] as String?,
      screenshotPath: fields[9] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, Session obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.date)
      ..writeByte(2)
      ..write(obj.venue)
      ..writeByte(3)
      ..write(obj.gameType)
      ..writeByte(4)
      ..write(obj.stakes)
      ..writeByte(5)
      ..write(obj.durationMinutes)
      ..writeByte(6)
      ..write(obj.buyIn)
      ..writeByte(7)
      ..write(obj.cashOut)
      ..writeByte(8)
      ..write(obj.notes)
      ..writeByte(9)
      ..write(obj.screenshotPath);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SessionAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
