<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class M_trx extends CI_Model{ 
    public function __construct(){
        parent::__construct();
		//$this->load->database('yanjakdis',false,true);
    }
	
	function get_trx($laporan_id){
		$q = $this->db->query("SELECT * FROM tmp_pelaporan_detail 
		WHERE tmp_pelaporan_id = '".$laporan_id."' ");
		$nilai_omset = 0;
		$tabel = array();
		foreach($q->result_array() as $r){
			$dt = json_decode($r['data'],true);
			$nilai_omset = $nilai_omset+$dt['service_charge'];
			$tabel[]=array(
				'laporan_detail_id'	=>$r['id'],
				'code'				=>$dt['code'],
				'bill_no'			=>$dt['bill_no'],
				'bill_no_end'		=>$dt['bill_no_end'],
				// 'no_faktur'			=>$dt['no_faktur'],
				'bill_count'		=>$dt['bill_count'],
				'service_charge'	=>$dt['service_charge'],
				'service_desc'		=>$dt['service_desc']
			);
		}
		$ret['tabel'] = $tabel;
		$ret['nilai_omset'] = $nilai_omset;
		return $ret;
	}
	
	
}
?>
