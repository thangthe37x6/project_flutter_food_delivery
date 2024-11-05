import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './list_miniapp/three.dart';
import './list_miniapp/providers/manager.dart';

void main() {
  runApp(ChangeNotifierProvider(
    create: (context) => Cart(),
    child: MaterialApp(debugShowCheckedModeBanner: false, home: homemain()),
  ));
}
