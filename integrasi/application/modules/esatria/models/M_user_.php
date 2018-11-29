<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class M_user extends CI_Model{
    public function __construct(){
        parent::__construct();
		//$this->load->database('yanjakdis',false,true);
    }
	
	function login($username,$password){
		$data = array();
		$q = $this->db->query("SELECT * FROM app_user 
		WHERE userid = '".$username."' and kunci_masuk = '". md5($password) . "'");
		if($q->num_rows()>0){
			
			$r = $q->row_array();
			$token = md5(sha1($username.date('ymdhis')));
			$log['userid'] = $username;
			$log['token'] = $token;
			$log['date_access'] = date('Y-m-d H:i:s');
			$log['expired'] = date('Y-m-d H:i:s');
			$this->db->insert('app_user_log',$log);
			$data = array(
				'token' => $token,
				'nama' =>$username
			);
			$hasil = true;
		}else{
			$hasil = false;
		}
		return array('data'=>$data,'hasil'=>$hasil);
	}
	
	function cektoken($tkn){
		$q = $this->db->query("SELECT * FROM app_user_log 
		WHERE token = '".$tkn."'")->row_array();
		if($tkn == $q['token']){
			return 1;
		}else{
			return 0;
		}
	}
	
	function datauser($tkn){ 
		$q = $this->db->query("SELECT * FROM app_user_log 
		WHERE token = '".$tkn."'")->row_array();
		if($tkn == $q['token']){
			return $q;
		}else{
			return false;
		}
	}
	
}
?>
