<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$active_group = 'default';
$query_builder = TRUE;

// $db['default'] = array(
// 	'dsn'=> '',
// 	'hostname' => 'localhost',
// 	'username' => 'postgres',
// 	'password' => 'jinto',
// 	'database' => 'sikp_db',
// 	//'database' => 'sikp_backup_10_24_2016',
// 	'schema'   => 'sikp',
// 	'port'	   => 5432,
// 	'dbdriver' => 'postgre',
// 	'dbprefix' => '',
// 	'pconnect' => FALSE,
// 	'db_debug' => (ENVIRONMENT !== 'production'),
// 	'cache_on' => FALSE,
// 	'cachedir' => '',
// 	'char_set' => 'utf8',
// 	'dbcollat' => 'utf8_general_ci',
// 	'swap_pre' => '',
// 	'encrypt' => FALSE,
// 	'compress' => FALSE,
// 	'stricton' => FALSE,
// 	'failover' => array(),
// 	'save_queries' => TRUE
// );

$db['default'] = array(
	'dsn'=> '',
	'hostname' => 'localhost',
	'username' => 'postgres',
	'password' => 'localhost7',
	'database' => 'sikp',
	//'database' => 'sikp_backup_10_24_2016',
	'schema'   => 'sikp',
	'port'	   => 5432,
	'dbdriver' => 'postgre',
	'dbprefix' => '',
	'pconnect' => FALSE,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8',
	'dbcollat' => 'utf8_general_ci',
	'swap_pre' => '',
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);