<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Esatria extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		$this->load->model('esatria/t_vat_settlement');

	}
	
	function getRequestHeaders() {
		$headers = array();
		foreach($_SERVER as $key => $value) {
			if (substr($key, 0, 5) <> 'HTTP_') {
				continue;
			}
			$header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
			$headers[$header] = $value;
		}
		return $headers;
	}
	
	public function index(){
		 show_404();
	}
	
	function login(){
		$username = $this->security->xss_clean($this->input->post('username'));
        $password = $this->security->xss_clean($this->input->post('password'));
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if(isset($_POST['username']) && isset($_POST['password'])){
			$sql = "SELECT cs.t_customer_user_id AS user_id,
						 cs.user_name,
						 cs.user_pwd AS user_password,
						 c.email_address AS user_email,
						 ca.company_brand as user_realname,
						 au.p_user_status_id as user_status
					FROM t_customer_user cs
					JOIN t_customer c ON c.t_customer_id = cs.t_customer_id
					JOIN t_cust_account ca ON ca.t_customer_id = cs.t_customer_id
					JOIN p_app_user au ON au.p_app_user_id = cs.p_app_user_id
					WHERE au.app_user_name = ? ";
   
	        $query = $this->db->query($sql, array($username));
	        $row = $query->row_array();

	        $token = md5(sha1($username.date('ymdhis')));
			$log['userid'] = $username;
			$log['token'] = $token;
			$log['date_access'] = date('Y-m-d H:i:s');
			$log['expired'] = date('Y-m-d H:i:s');
			//$this->db->insert('app_user_log',$log);
			$data = array(
				'token' => $token,
				'nama'  =>$username
			);
			$hasil = true;

	        $md5pass = md5(trim($password));

	        if( strcmp($md5pass, trim($row['user_password'])) != 0 ) {
	            $code = 3;
			 	$message = 'Username atau Password Salah';
	        }

	        if($row['user_status'] != 1) {
	        	$code = 4;
			 	$message = 'Maaf, User yang bersangkutan sudah tidak aktif. Silahkan hubungi administrator.';
	        }

	        /* cara 1 */
	        // $sql = "select * from sikp.f_get_npwd_by_username_wp('".$row['user_name']."')";
 
	        // $query = $this->db->query($sql);
	        // $row2  = $query->row_array();
	        /* cara 2 */
	        $sql = "SELECT
						d_ca.t_cust_account_id,
						d_ca.npwd,
						COALESCE ( d_ca.company_name, d_ca.company_brand ) AS company_name,
						d_ca.p_vat_type_dtl_id,
						d_ca.p_vat_type_id 
					FROM
						t_customer_user d_cu
						JOIN t_cust_account d_ca ON d_ca.t_customer_id = d_cu.t_customer_id
						JOIN p_vat_type rtv ON rtv.p_vat_type_id = d_ca.p_vat_type_id
						JOIN p_vat_type_dtl rtvd ON rtvd.p_vat_type_dtl_id = d_ca.p_vat_type_dtl_id 
					WHERE
						d_cu.user_name = '".$row['user_name']."'";
 
	        $query = $this->db->query($sql);
	        $row2  = $query->row_array();

	        /* khusus restoran */
	        /*$sql = " select to_number(value) as nilai_limit_nihil_restoran, value_2 as is_active_limit_restoran
                     from sikp.p_global_param
                     where code = 'LIMIT_NIHIL_RESTORAN'";*/
            $sql = "SELECT value AS nilai_limit_nihil_restoran, value_2 as is_active_limit_restoran
	               FROM p_global_param
				   WHERE code = 'LIMIT_NIHIL_RESTORAN' ";

	        $query = $this->db->query($sql);
	        $item_param_restoran  = $query->row_array();

	        if($row2['p_vat_type_dtl_id'] != 9 AND
	            $row2['p_vat_type_dtl_id'] != 10) {
	            $item_param_restoran['is_active_limit_restoran'] = 'N';
	        }

	        $data = array(
				'user_id'           		 => $row['user_id'],
				'user_name'         		 => $row['user_name'],
				'user_email'        		 => $row['user_email'],
				'user_realname'     		 => $row['user_realname'],
				'cust_account_id'  			 => $row2['t_cust_account_id'],
				'npwd'     					 => $row2['npwd'],
				'company_name'      		 => $row2['company_name'],
				'vat_type_dtl'      		 => $row2['p_vat_type_dtl_id'],
				'vat_type_id'      		     => $row2['p_vat_type_id'],
				'logged_in'         		 => true,
				'nilai_limit_nihil_restoran' => $item_param_restoran['nilai_limit_nihil_restoran'],
				'is_active_limit_restoran'   => $item_param_restoran['is_active_limit_restoran'],
				'token' 					 => $token,
				'nama'  					 => $row['user_realname'],
				'expired'  					 => date('d')
           );
		}
		else{
			$code = 2;
			$message = 'Parameter Tidak Lengkap';	
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function get_periode($token){
		$cust_account_id = $this->input->post('cust_account_id');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['cust_account_id'])) {
				/*$sql = "SELECT *,to_char(start_date,'dd-mm-yyyy') as start_date_string,to_char(end_date,'dd-mm-yyyy') as end_date_string
						from view_finance_period_bayar
						where p_finance_period_id - 1<= (
						SELECT p_finance_period_id p_f_p_id
						from view_finance_period_bayar
						where  to_char(start_date,'yyyy-mm-dd') in (
						select start_period start_periods
								from (select *
									from
														(select c.npwd,
																	a.t_vat_setllement_id,
																	a.t_customer_order_id,
																	a.is_surveyed,

																		a.payment_key,
																		c.company_name,
																		b.code as periode_pelaporan,
																		to_char(a.settlement_date,'DD-MON-YYYY') tgl_pelaporan,
																		a.total_trans_amount as total_transaksi,
																		a.total_vat_amount as total_pajak ,
																	nvl(a.total_penalty_amount,0) as total_denda,
																		d.receipt_no as kuitansi_pembayaran,
																		to_char(payment_date,'DD-MON-YYYY HH24:MI:SS') tgl_pembayaran ,
																		d.payment_amount,
																		c.t_cust_account_id ,
																		b.p_finance_period_id ,
																		to_char(a.start_period, 'yyyy-mm-dd') as start_period,
																		to_char(a.end_period, 'yyyy-mm-dd') as end_period,
																		to_char(a.start_period,'DD-MON-YYYY') as periode_awal_laporan,
																		to_char(a.end_period,'DD-MON-YYYY') as periode_akhir_laporan,
																		e.code as type_code,
																		nvl(A.debt_vat_amt,a.total_vat_amount) as debt_vat_amt,
																		nvl(a.db_increasing_charge,0) as db_increasing_charge,
																		nvl(A.debt_vat_amt,a.total_vat_amount) + nvl(a.db_increasing_charge,0) +nvl(a.db_interest_charge,0) + nvl(a.total_penalty_amount,0) as total_hrs_bayar,
																		nvl(a.db_increasing_charge,0) as kenaikan,
																		nvl(a.db_interest_charge,0) as kenaikan1,
																		a.p_vat_type_dtl_id,
																		a.no_kohir,
																		to_char(a.due_date,'DD-MON-YYYY') as jatuh_tempo,
																		settlement_date,
																		b.start_date
															from t_vat_setllement a,
																	p_finance_period b,
																	t_cust_account c,
																	t_payment_receipt d,
																	p_settlement_type e,
																	p_app_user f
															where a.p_finance_period_id = b.p_finance_period_id
															and start_period is not null
																		and a.t_cust_account_id = c.t_cust_account_id
																	and a.t_cust_account_id =  ".$cust_account_id."
																		and a.t_vat_setllement_id = d.t_vat_setllement_id 
																	and a.p_settlement_type_id = e.p_settlement_type_id
																	and a.created_by = f.app_user_name ) as hasil
									left join p_vat_type_dtl x on x.p_vat_type_dtl_id = hasil.p_vat_type_dtl_id) as data_transaksi

									left join t_cust_acc_masa_jab masa_jab
									on masa_jab.t_cust_account_id = data_transaksi.t_cust_account_id
									and masa_awal <= settlement_date
									and
										case
											when masa_akhir is NULL
											then true
											when masa_akhir >= settlement_date
											then masa_akhir >= settlement_date
										end
						order by start_periods desc
						limit 1))
						limit 36";*/
				$sql = "SELECT *,
							to_char(start_date,'dd-mm-yyyy') as start_date_string,
							to_char(end_date,'dd-mm-yyyy') as end_date_string
						FROM
							view_finance_period_bayar 
						WHERE
							p_finance_period_id - 1 <= (
						SELECT
							p_finance_period_id r_fp 
						FROM
							view_finance_period_bayar 
						WHERE
							CAST ( start_date AS DATE ) IN (
						SELECT
							start_period AS start_periods 
						FROM
							(
						SELECT
							* 
						FROM
							(
						SELECT CAST
							( d_vs.start_period AS DATE ) AS start_period,
							CAST ( d_vs.end_period AS DATE ) AS end_period,
							d_vs.p_vat_type_dtl_id AS p_vat_type_dtl_id_2,
							d_vs.t_cust_account_id,
							d_vs.settlement_date AS settlement_date 
						FROM
							t_vat_setllement d_vs
							JOIN p_finance_period r_fp ON d_vs.p_finance_period_id = r_fp.p_finance_period_id
							JOIN p_settlement_type r_st ON d_vs.p_settlement_type_id = r_st.p_settlement_type_id 
						WHERE
							d_vs.t_cust_account_id = '$cust_account_id' 
							)
							AS RESULT LEFT JOIN p_vat_type_dtl r_vtd ON r_vtd.p_vat_type_dtl_id = RESULT.p_vat_type_dtl_id_2 
							) AS data_transaksi
							LEFT JOIN t_cust_acc_masa_jab d_camj ON d_camj.t_cust_account_id = data_transaksi.t_cust_account_id 
							AND masa_awal <= data_transaksi.settlement_date 
						AND
						CASE
							
							WHEN masa_akhir IS NULL THEN
						TRUE 
							WHEN masa_akhir >= data_transaksi.settlement_date THEN
							masa_akhir >= data_transaksi.settlement_date 
						END 
						ORDER BY
							start_periods DESC 
							) 
							LIMIT 1 
							) 
						LIMIT 36";
	        	$data = $this->db->query($sql)->result();  
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else {
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function get_klasifikasi($token){
		$vat_type_dtl = $this->input->post('vat_type_dtl');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['vat_type_dtl'])) {
				$sql = "SELECT * FROM p_vat_type_dtl where p_vat_type_dtl_id = '$vat_type_dtl'";
	        	$data = $this->db->query($sql)->result();
			}
			else{
				$code = 3;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else {
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function get_rincian($token){
		$vat_type_dtl = $this->input->post('vat_type_dtl');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['vat_type_dtl'])) {
				$sql = "SELECT * FROM p_vat_type_dtl_cls where p_vat_type_dtl_id = '$vat_type_dtl'";
	        	$data = $this->db->query($sql)->result();
			}
			else{
				$code = 3;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else {
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function get_laporan($token){
		$per = $this->input->post('periode');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if ($per != '') {
				$sql = "SELECT *, to_char( start_date, 'dd-mm-yyyy' ) AS start_date_string,
						to_char( end_date, 'dd-mm-yyyy' ) AS end_date_string, date_part ('year', start_date ) AS tahun, date_part ('month', start_date ) AS tanggal 
						FROM p_finance_period 
						Where p_finance_period_id = '$per'";
	         	$query = $this->db->query($sql);
	         	$row = $query->row_array(); 
	        	if ($row['tanggal'] < 10) {
					$nowdate = $row['tahun'].'-'.'0'.$row['tanggal'];
					$getdate = '0'.$row['tanggal'].'-'.$row['tahun'];
					$sql1 = "SELECT due_in_day
						 	 FROM p_finance_period 
						 	 Where to_char( start_date, 'MM-YYYY' ) = '$getdate'";
		         	$query1 = $this->db->query($sql1);
		         	$row1   = $query->row_array(); 
		         	$nowdate_ = $row['tahun'].'-'.'0'.$row['tanggal'].'-'.$row1['due_in_day'];
					$getdate_ = '0'.$row['tanggal'].'-'.$row['tahun'].'-'.$row1['due_in_day'];
				}
				else {
					$nowdate = $row['tahun'].'-'.$row['tanggal'];
					$getdate = $row['tanggal'].'-'.$row['tahun'];
					$sql1 = "SELECT due_in_day
						 	 FROM p_finance_period 
						 	 Where to_char( start_date, 'MM-YYYY' ) = '$getdate'";
		         	$query1 = $this->db->query($sql1);
		         	$row1   = $query->row_array(); 
		         	$nowdate_ = $row['tahun'].'-'.$row['tanggal'].'-'.$row1['due_in_day'];
					$getdate_ = '0'.$row['tanggal'].'-'.$row['tahun'].'-'.$row1['due_in_day'];
				}
				$sekarang = date('Y-m-d');
				// $q = "SELECT
				// 	  DATE_PART('day', CURRENT_DATE :: TIMESTAMP - TO_DATE('".$nowdate_."', 'yyyy-mm-dd')) as boolDenda,
				// 	  ceiling(months_between(current_date::timestamp , TO_DATE('". $nowdate_ ."', 'yyyy-mm-dd')::timestamp)) boolDendaMonth";
				$q = "SELECT
					  DATE_PART('day', CURRENT_DATE :: TIMESTAMP - TO_DATE('".$nowdate_."', 'yyyy-mm-dd')) as boolDenda,
					  EXTRACT(YEAR FROM age) * 12 + EXTRACT(MONTH FROM age) AS boolDendaMonth
					  FROM age(TIMESTAMP '$sekarang', TIMESTAMP '".$nowdate_."') AS t(age)";
				$query2 = $this->db->query($q);
	        	$tam 	= $query2->row_array(); 

				$data['p_finance_period_id']	= $row['p_finance_period_id'];
				$data['p_year_period_id'] 		= $row['p_year_period_id'];
				$data['boolDenda'] 				= $tam['booldenda'];
				$data['boolDendaMonth'] 		= $tam['booldendamonth'];
				$data['masa_pajak_awal'] 		= $row['start_date_string'];
				$data['masa_pajak_akhir'] 		= $row['end_date_string'];
				$data['start_period'] 			= $row['start_date_string'];
				$data['end_period'] 			= $row['end_date_string'];
				$data['nilai_omset'] 			= 0;
				$data['pajak'] 					= 0;
				$data['denda'] 					= 0;
				$data['total_bayar'] 			= 0;
			}
			else{
				$code = 2;
		 		$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}		
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function get_tabel($token){
		$npwd 	 	     = $this->input->post('npwd');
		$periode 	 	 = $this->input->post('periode');
		$vat_pct 	 	 = $this->input->post('vat_pct');
		$vat_type_dtl 	 = $this->input->post('vat_type_dtl');
		$cust_account_id = $this->input->post('cust_account_id');
		$start_period 	 = $this->input->post('start_period');
		$end_period   	 = $this->input->post('end_period');
		$mulai 			 = tgl_ind_to_eng($start_period);
		$akhir 			 = tgl_ind_to_eng($end_period);
		$pisah_mulai	 = explode('-', $mulai);
		$gabung_mulai	 = $pisah_mulai[0].'-'.$pisah_mulai[1].'-'.($pisah_mulai[2]-1);
		$sampai			 = explode('-', $akhir);
		if ($vat_pct == '5') {
			$ref_vat_type_dtl_cls_id = '1';
		} elseif($vat_pct == '7'){
			$ref_vat_type_dtl_cls_id = '2';
		} elseif($vat_pct == '10'){
			$ref_vat_type_dtl_cls_id = '3';
		} elseif($vat_pct == '15'){
			$ref_vat_type_dtl_cls_id = '4';
		} elseif($vat_pct == '7.5'){
			$ref_vat_type_dtl_cls_id = '5';
		} else{
			$ref_vat_type_dtl_cls_id = '6';
		}
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		$num_rows = 0;
		if($token != ''){
			if($periode != ''){
				$sql = "SELECT * 
							FROM (
							SELECT
								a.t_cust_acc_dtl_trans_id,
								a.t_cust_account_id,
								a.trans_date,
								CAST( trans_date AS DATE ) AS trans_date_txt,
								to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
								a.bill_no,
								a.bill_no_end,
								a.bill_count,
								a.service_desc,
								a.service_charge,
								a.vat_charge,
								a.description,
								a.p_vat_type_dtl_id,
								a.p_vat_type_dtl_cls_id 
							FROM
								t_cust_acc_dtl_trans a 
							WHERE
								a.t_cust_account_id = '".$cust_account_id."' 
								) AS tbl
								LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
							WHERE
								p_vat_type_dtl_id = '".$vat_type_dtl."'
								AND p_finance_period_id = '".$periode."'
								AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
								AND '".$end_period."' 
							ORDER BY
								t_cust_acc_dtl_trans_id ASC";
		       	$hasil = $this->db->query($sql)->result();
		       	$num_rows = $this->db->query($sql)->num_rows();
				if ($vat_type_dtl == 35) {
		       		if ($num_rows < 1) {
			       		$sql = "DELETE FROM t_cust_acc_dtl_trans a
								WHERE a.t_cust_account_id = '".$cust_account_id."'
								and not exists (select 1
								from t_vat_setllement_dtl x
								where x.t_cust_acc_dtl_trans_id = a.t_cust_acc_dtl_trans_id)";
						$result = $this->db->query($sql);

						for($i=0; $i<$sampai[2]; $i++) {
							$t_vat_id = "SELECT nextval('t_cust_acc_dtl_trans_seq') as t_cust_acc_dtl_trans_id";
							$da = $this->db->query($t_vat_id)->result();
				        	foreach ($da as $value) {
				        		$id_auto = $value->t_cust_acc_dtl_trans_id;
				        	}
				        	$repeat = strtotime("+1 day",strtotime($gabung_mulai));
				   			$gabung_mulai  = date('Y-m-d',$repeat);
							$dat = array(
								't_cust_acc_dtl_trans_id'=>$id_auto,
								't_cust_account_id'		=>$cust_account_id,
								'trans_date'			=>$gabung_mulai,
								'bill_no'				=>'',
								'bill_no_end'			=>'',
								'bill_count'			=>0,
								'service_charge'		=>0,
								'service_desc'			=>'',
								'vat_charge'			=>0,
								'p_vat_type_dtl_id'		=>$vat_type_dtl,
								'p_vat_type_dtl_cls_id' =>$ref_vat_type_dtl_cls_id,
								'creation_date'			=>date("Y-m-d H:i:s"),
								'created_by'			=>$npwd,
								'updated_date'			=>date("Y-m-d H:i:s"),
								'updated_by'			=>$npwd
							);
							$this->db->insert('t_cust_acc_dtl_trans', $dat);
							$sql = "SELECT * 
								FROM (
								SELECT
									a.t_cust_acc_dtl_trans_id,
									a.t_cust_account_id,
									a.trans_date,
									CAST( trans_date AS DATE ) AS trans_date_txt,
									to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
									a.bill_no,
									a.bill_no_end,
									a.bill_count,
									a.service_desc,
									a.service_charge,
									a.vat_charge,
									a.description,
									a.p_vat_type_dtl_id,
									a.p_vat_type_dtl_cls_id 
								FROM
									t_cust_acc_dtl_trans a 
								WHERE
									a.t_cust_account_id = '".$cust_account_id."' 
									) AS tbl
									LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
								WHERE
									p_vat_type_dtl_id = '".$vat_type_dtl."'
									AND p_finance_period_id = '".$periode."'
									AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
									AND '".$end_period."' 
								ORDER BY
									t_cust_acc_dtl_trans_id ASC";
				       		$data = $this->db->query($sql)->result();
				       		$num_rows = $this->db->query($sql)->num_rows();
						}
		       		}
		       		else{
		       			$data = $hasil;
		       		}
				}
				else{
		       		if ($num_rows < 1) {
			       		$sql = "DELETE FROM t_cust_acc_dtl_trans a
								WHERE a.t_cust_account_id = '".$cust_account_id."'
								and not exists (select 1
								from t_vat_setllement_dtl x
								where x.t_cust_acc_dtl_trans_id = a.t_cust_acc_dtl_trans_id)";
						$result = $this->db->query($sql);

						for($i=0; $i<$sampai[2]; $i++) {
							$t_vat_id = "SELECT nextval('t_cust_acc_dtl_trans_seq') as t_cust_acc_dtl_trans_id";
							$da = $this->db->query($t_vat_id)->result();
				        	foreach ($da as $value) {
				        		$id_auto = $value->t_cust_acc_dtl_trans_id;
				        	}
				        	$repeat = strtotime("+1 day",strtotime($gabung_mulai));
				   			$gabung_mulai  = date('Y-m-d',$repeat);
							$dat = array(
								't_cust_acc_dtl_trans_id'=>$id_auto,
								't_cust_account_id'		=>$cust_account_id,
								'trans_date'			=>$gabung_mulai,
								'bill_no'				=>'',
								'bill_no_end'			=>'',
								'bill_count'			=>0,
								'service_charge'		=>0,
								'service_desc'			=>'',
								'vat_charge'			=>0,
								'p_vat_type_dtl_id'		=>$vat_type_dtl,
								'creation_date'			=>date("Y-m-d H:i:s"),
								'created_by'			=>$npwd,
								'updated_date'			=>date("Y-m-d H:i:s"),
								'updated_by'			=>$npwd
							);
							$this->db->insert('t_cust_acc_dtl_trans', $dat);
							$sql = "SELECT * 
								FROM (
								SELECT
									a.t_cust_acc_dtl_trans_id,
									a.t_cust_account_id,
									a.trans_date,
									CAST( trans_date AS DATE ) AS trans_date_txt,
									to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
									a.bill_no,
									a.bill_no_end,
									a.bill_count,
									a.service_desc,
									a.service_charge,
									a.vat_charge,
									a.description,
									a.p_vat_type_dtl_id,
									a.p_vat_type_dtl_cls_id 
								FROM
									t_cust_acc_dtl_trans a 
								WHERE
									a.t_cust_account_id = '".$cust_account_id."' 
									) AS tbl
									LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
								WHERE
									p_vat_type_dtl_id = '".$vat_type_dtl."'
									AND p_finance_period_id = '".$periode."'
									AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
									AND '".$end_period."' 
								ORDER BY
									t_cust_acc_dtl_trans_id ASC";
				       		$data = $this->db->query($sql)->result();
				       		$num_rows = $this->db->query($sql)->num_rows();
						}
		       		}
		       		else{
		       			$data = $hasil;
		       		}
				}
			}else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';	
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data,
			'jumlah'=>$num_rows
		);
		echo json_encode($respons);
	}

	function get_transaksi($token){
		$id 			 = $this->input->post('dat_cust_acc_dtl_trans_id');
		$vat_type_dtl 	 = $this->input->post('vat_type_dtl');
		$cust_account_id = $this->input->post('cust_account_id');
		$start_period 	 = $this->input->post('start_period');
		$end_period   	 = $this->input->post('end_period');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['dat_cust_acc_dtl_trans_id'])) {
				$sql = "SELECT * 
						FROM (
						SELECT
							a.t_cust_acc_dtl_trans_id,
							a.t_cust_account_id,
							a.trans_date,
							CAST( trans_date AS DATE ) AS trans_date_txt,
							to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
							a.bill_no,
							a.bill_no_end,
							a.bill_count,
							a.service_desc,
							a.service_charge,
							a.vat_charge,
							a.description,
							a.p_vat_type_dtl_id,
							a.p_vat_type_dtl_cls_id 
						FROM
							t_cust_acc_dtl_trans a 
						WHERE
							a.t_cust_account_id = '".$cust_account_id."' 
							) AS tbl
							LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
						WHERE
							p_vat_type_dtl_id = '".$vat_type_dtl."'
							AND t_cust_acc_dtl_trans_id = '".$_POST['dat_cust_acc_dtl_trans_id']."'
							AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
							AND '".$end_period."' 
						ORDER BY
							t_cust_acc_dtl_trans_id DESC";
				$data = $this->db->query($sql)->row_array();
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 2;
			$message = 'Token Not Valid';
		}	
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function edit_transaksi($token,$booldendamonth,$booldenda,$nilai_pajak){
		$cust_account_id = $this->input->post('cust_account_id');
		$periode 	 	 = $this->input->post('periode');
		$start_period 	 = $this->input->post('start_period');
		$end_period 	 = $this->input->post('end_period');
		$id     		 = $this->input->post('dat_cust_acc_dtl_trans_id');
		$vat_type_dtl 	 = $this->input->post('vat_type_dtl');
		$tgl    		 = $this->input->post('tanggal');
		$awal   		 = $this->input->post('no_faktur_awal');
		$akhir  		 = $this->input->post('no_faktur_akhir');
		$jml 			 = $this->input->post('jml_faktur');
		$penjualan  	 = $this->input->post('jml_penjualan');
		$deskripsi  	 = $this->input->post('deskripsi');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['dat_cust_acc_dtl_trans_id'])) {
				if ($nilai_pajak != '0') {
					$d['bill_no']  			= $awal;
					$d['bill_no_end'] 		= $akhir;
					$d['bill_count'] 		= $jml;
					$d['service_charge'] 	= $penjualan;
					$d['service_desc'] 		= $deskripsi;
					$d['description'] 		= $deskripsi;
					$this->db->where('t_cust_acc_dtl_trans_id', $id);
					$this->db->update('t_cust_acc_dtl_trans', $d);

					$q = "SELECT * 
							FROM (
							SELECT
								a.t_cust_acc_dtl_trans_id,
								a.t_cust_account_id,
								a.trans_date,
								CAST( trans_date AS DATE ) AS trans_date_txt,
								to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
								a.bill_no,
								a.bill_no_end,
								a.bill_count,
								a.service_desc,
								a.service_charge,
								a.vat_charge,
								a.description,
								a.p_vat_type_dtl_id,
								a.p_vat_type_dtl_cls_id 
							FROM
								t_cust_acc_dtl_trans a 
							WHERE
								a.t_cust_account_id = '".$cust_account_id."' 
								) AS tbl
								LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
							WHERE
								p_vat_type_dtl_id = '".$vat_type_dtl."'
								AND p_finance_period_id = '".$periode."'
								AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
								AND '".$end_period."' 
							ORDER BY
								t_cust_acc_dtl_trans_id ASC";
					$query = $this->db->query($q)->result();
					$nilai_omset = 0;
					//$nilai_omset = $penjualan;
					$tabel = array();
					foreach ($query as $r) {
						$nilai_omset = $nilai_omset+$r->service_charge;
						$tabel[]=array(
							't_cust_acc_dtl_trans_id'=>$r->t_cust_acc_dtl_trans_id,
							'trans_date'		=>$r->trans_date_jqgrid,
							'bill_no'			=>$r->bill_no,
							'bill_no_end'		=>$r->bill_no_end,
							'bill_count'		=>$r->bill_count,
							'service_charge'	=>$r->service_charge,
							'service_desc'		=>$r->service_desc
						);
				    }

					if ($vat_type_dtl == '11') {
				    	$pajak = 0.01 * $nilai_omset * $nilai_pajak;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }
				    else{
				    	$pajak = 0.01 * $nilai_omset * $nilai_pajak;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0.02 * $pajak * $kelipatan_denda;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }
					
					$d['vat_charge'] =  0.01 * $penjualan * $nilai_pajak;
					$this->db->where('t_cust_acc_dtl_trans_id', $id);
					$this->db->update('t_cust_acc_dtl_trans', $d);
					$da = array(
						'nilai_omset' => $nilai_omset,
						'pajak' 	  => $pajak,
						'denda' 	  => round($denda),
						'total_bayar' => round($pajak + $denda)
					);
					$data['hasil'] = $da;
					$data['tabel'] = $tabel;
				}
				else{
					$limit_restoran  = $this->input->post('limit_restoran');
					$limit_active  	 = $this->input->post('limit_active');
					$klasifikasi 	 = $this->input->post('klasifikasi');

					$d['bill_no']  			= $awal;
					$d['bill_no_end'] 		= $akhir;
					$d['bill_count'] 		= $jml;
					$d['service_charge'] 	= $penjualan;
					$d['service_desc'] 		= $deskripsi;
					$d['description'] 		= $deskripsi;
					$this->db->where('t_cust_acc_dtl_trans_id', $id);
					$this->db->update('t_cust_acc_dtl_trans', $d);

					$q = "SELECT * 
							FROM (
							SELECT
								a.t_cust_acc_dtl_trans_id,
								a.t_cust_account_id,
								a.trans_date,
								CAST( trans_date AS DATE ) AS trans_date_txt,
								to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
								a.bill_no,
								a.bill_no_end,
								a.bill_count,
								a.service_desc,
								a.service_charge,
								a.vat_charge,
								a.description,
								a.p_vat_type_dtl_id,
								a.p_vat_type_dtl_cls_id 
							FROM
								t_cust_acc_dtl_trans a 
							WHERE
								a.t_cust_account_id = '".$cust_account_id."' 
								) AS tbl
								LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
							WHERE
								p_vat_type_dtl_id = '".$vat_type_dtl."'
								AND p_finance_period_id = '".$periode."'
								AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
								AND '".$end_period."' 
							ORDER BY
								t_cust_acc_dtl_trans_id ASC";
					$query = $this->db->query($q)->result();
					$nilai_omset = 0;
					//$nilai_omset = $penjualan;
					$tabel = array();
					foreach ($query as $r) {
						$nilai_omset = $nilai_omset+$r->service_charge;
						$tabel[]=array(
							't_cust_acc_dtl_trans_id'=>$r->t_cust_acc_dtl_trans_id,
							'trans_date'		=>$r->trans_date_jqgrid,
							'bill_no'			=>$r->bill_no,
							'bill_no_end'		=>$r->bill_no_end,
							'bill_count'		=>$r->bill_count,
							'service_charge'	=>$r->service_charge,
							'service_desc'		=>$r->service_desc
						);
				    }

					$nilai_pajak = 1;

					if ($limit_active == 'Y' and $klasifikasi == 'RESTORAN' and $penjualan < $limit_restoran) {
				    	$pajak = 0;
				    	$denda = 0;
				    }
				    elseif ($klasifikasi == 'KATERING' and $limit_active == 'Y') {
				    	$pajak = 0.01 * $nilai_omset * $nilai_pajak;
				    	$denda = 0;
				    }
					elseif ($vat_type_dtl == '11') {
				    	$pajak = 0.01 * $nilai_omset * $nilai_pajak;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }
				    else{
				    	$pajak = 0.01 * $nilai_omset * $nilai_pajak;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0.02 * $pajak * $kelipatan_denda;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }
					
					$d['vat_charge'] = 0.01 * $penjualan * $nilai_pajak;
					$this->db->where('t_cust_acc_dtl_trans_id', $id);
					$this->db->update('t_cust_acc_dtl_trans', $d);
					$da = array(
						'nilai_omset' => $nilai_omset,
						'pajak' 	  => $pajak,
						'denda' 	  => round($denda),
						'total_bayar' => round($pajak + $denda)
					);
					$data['hasil'] = $da;
					$data['tabel'] = $tabel;
				}
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function delete_transaksi($token){
		$cust_account_id = $this->input->post('cust_account_id');
		$code = 1;
		$message = 'Berhasil';
		if ($token != '') {
			if (isset($_POST['cust_account_id'])) {
				$sql = "DELETE FROM t_cust_acc_dtl_trans a
						WHERE a.t_cust_account_id = '".$cust_account_id."'
							and not exists (select 1
							from t_vat_setllement_dtl x
							where x.t_cust_acc_dtl_trans_id = a.t_cust_acc_dtl_trans_id)";
				$result = $this->db->query($sql);
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message
		);
		echo json_encode($respons);
	}

	function prosesupload($token,$booldendamonth,$booldenda,$nilai_pajak,$npwd,$cust_account_id,$vat_type_dtl,$periode,$vat_pct,$start_period,$end_period){
		if ($vat_pct == '5') {
			$p_vat_type_dtl_cls_id = '1';
		}
		elseif($vat_pct == '7'){
			$p_vat_type_dtl_cls_id = '2';
		}
		elseif($vat_pct == '10'){
			$p_vat_type_dtl_cls_id = '3';
		}
		elseif($vat_pct == '15'){
			$p_vat_type_dtl_cls_id = '4';
		}
		elseif($vat_pct == '7.5'){
			$p_vat_type_dtl_cls_id = '5';
		}
		else{
			$p_vat_type_dtl_cls_id = '6';
		}
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if ($cust_account_id != '') {
				$config['upload_path'] = './temp_upload/';
				$config['allowed_types'] = 'xlsx|xls';
				$config['max_size'] = 51200;
				$this->load->library('upload', $config);
				if ($nilai_pajak != '0') {
					if (!$this->upload->do_upload('myfile')){
						$code = 0;
						$message = $this->upload->display_errors('','');
					}
					else{
						$file = $this->upload->data();
						$fileku =  $file['full_path'];
						$this->load->library("PHPExcel");
						$this->load->library("PHPExcel/IOFactory");
						$objPHPExcel = new PHPExcel();
						$objReader = IOFactory::createReaderForFile($fileku);
						$objReader->setReadDataOnly(true);
						$excel  = $objReader->load($fileku);
						$sheets = $objReader->listWorksheetNames($fileku);
						$_sheet = $excel->setActiveSheetIndexByName($sheets[0]);
						$maxRow = $_sheet->getHighestRow();
						$maxCol = $_sheet->getHighestColumn();
						$field  = array();
						$sql    = array();
						$maxCol = range('A',$maxCol);
						for($i = 3; $i <= $maxRow; $i++){
							foreach($maxCol as $k => $coloumn){
								$sql[$k]  = $_sheet->getCell($coloumn.$i)->getCalculatedValue();
							}

							$sql_del = "DELETE FROM t_cust_acc_dtl_trans a
							WHERE a.t_cust_account_id = '".$cust_account_id."'
							and not exists (select 1
							from t_vat_setllement_dtl x
							where x.t_cust_acc_dtl_trans_id = a.t_cust_acc_dtl_trans_id)";
							$result = $this->db->query($sql_del);

							$t_vat_id = "SELECT nextval('t_cust_acc_dtl_trans_seq') as t_cust_acc_dtl_trans_id";
							$da = $this->db->query($t_vat_id)->result();
				        	foreach ($da as $value) {
				        		$id_auto = $value->t_cust_acc_dtl_trans_id;
				        	}

				        	$bill = explode('-', $sql[1]);
				        	$temp_date = tgl_ind_to_eng($start_period);
				        	if ($temp_date != $sql[0]) {
				        		$code = 2;
				        		$message = 'Laporan masa pajak anda ini tidak sesuai dengan Laporan Rekapitulasi Penerimaan Harian. Cek kembali pemilihan masa pajak';
				        	}
				        	else{
								$dat = array(
									't_cust_acc_dtl_trans_id'=>$id_auto,
									't_cust_account_id'		=>$cust_account_id,
									'trans_date'			=>$sql[0],
									'bill_no'				=>$bill[0],
									'bill_no_end'			=>$bill[1],
									'bill_count'			=>$sql[2],
									'service_charge'		=>$sql[3],
									'service_desc'			=>$sql[4],
									'description'			=>$sql[4],
									'p_vat_type_dtl_id'		=>$vat_type_dtl,
									'p_vat_type_dtl_cls_id'	=>$p_vat_type_dtl_cls_id,
									'creation_date'			=>date("Y-m-d H:i:s"),
									'created_by'			=>$npwd,
									'updated_date'			=>date("Y-m-d H:i:s"),
									'updated_by'			=>$npwd
								);
								$this->db->insert('t_cust_acc_dtl_trans', $dat);
							}
						}
					}
					
					$q = "SELECT * 
						FROM (
						SELECT
							a.t_cust_acc_dtl_trans_id,
							a.t_cust_account_id,
							a.trans_date,
							CAST( trans_date AS DATE ) AS trans_date_txt,
							to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
							a.bill_no,
							a.bill_no_end,
							a.bill_count,
							a.service_desc,
							a.service_charge,
							a.vat_charge,
							a.description,
							a.p_vat_type_dtl_id,
							a.p_vat_type_dtl_cls_id 
						FROM
							t_cust_acc_dtl_trans a 
						WHERE
							a.t_cust_account_id = '".$cust_account_id."' 
							) AS tbl
							LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
						WHERE
							p_vat_type_dtl_id = '".$vat_type_dtl."'
							AND p_finance_period_id = '".$periode."'
							AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
							AND '".$end_period."' 
						ORDER BY
							t_cust_acc_dtl_trans_id ASC";
					$query = $this->db->query($q)->result();
					$nilai_omset = 0;
					//$nilai_omset = $sql[3];
					$tabel = array();
					foreach ($query as $r) {
						$nilai_omset = $nilai_omset+$r->service_charge;
						$tabel[]=array(
							't_cust_acc_dtl_trans_id'=>$r->t_cust_acc_dtl_trans_id,
							'trans_date'		=>$r->trans_date_jqgrid,
							'bill_no'			=>$r->bill_no,
							'bill_no_end'		=>$r->bill_no_end,
							'bill_count'		=>$r->bill_count,
							'service_charge'	=>$r->service_charge,
							'service_desc'		=>$r->service_desc
						);
				    }

					if ($vat_type_dtl == '11') {
				    	$pajak = ($nilai_omset * $nilai_pajak) / 100;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }
				    else{
				    	$pajak = ($nilai_omset * $nilai_pajak) / 100;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0.02 * $pajak * $kelipatan_denda;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }

				    if ($temp_date != $sql[0]) {
				    	$code = 2;
				    	$message = 'Laporan masa pajak anda ini tidak sesuai dengan Laporan Rekapitulasi Penerimaan Harian. Cek kembali pemilihan masa pajak';
				    }
				    else{
						$d['vat_charge'] = $pajak;
						$this->db->where('t_cust_acc_dtl_trans_id', $id_auto);
						$this->db->update('t_cust_acc_dtl_trans', $d);
					}
					$da = array(
						//'t_cust_acc_dtl_trans_id'=>$id_auto,
						'nilai_omset' => $nilai_omset,
						'pajak' 	  => $pajak,
						'denda' 	  => $denda,
						'total_bayar' => $pajak + $denda
					);
					$data['hasil'] = $da;
					$data['tabel'] = $tabel;
				}
				else{
					if (!$this->upload->do_upload('myfile')){
						$code = 0;
						$message = $this->upload->display_errors('','');
					}
					else{
						$file = $this->upload->data();
						$fileku =  $file['full_path'];
						$this->load->library("PHPExcel");
						$this->load->library("PHPExcel/IOFactory");
						$objPHPExcel = new PHPExcel();
						$objReader = IOFactory::createReaderForFile($fileku);
						$objReader->setReadDataOnly(true);
						$excel  = $objReader->load($fileku);
						$sheets = $objReader->listWorksheetNames($fileku);
						$_sheet = $excel->setActiveSheetIndexByName($sheets[0]);
						$maxRow = $_sheet->getHighestRow();
						$maxCol = $_sheet->getHighestColumn();
						$field  = array();
						$sql    = array();
						$maxCol = range('A',$maxCol);
						for($i = 3; $i <= $maxRow; $i++){
							foreach($maxCol as $k => $coloumn){
								$sql[$k]  = $_sheet->getCell($coloumn.$i)->getCalculatedValue();
							}

							$sql_del = "DELETE FROM t_cust_acc_dtl_trans a
							WHERE a.t_cust_account_id = '".$cust_account_id."'
							and not exists (select 1
							from t_vat_setllement_dtl x
							where x.t_cust_acc_dtl_trans_id = a.t_cust_acc_dtl_trans_id)";
							$result = $this->db->query($sql_del);

							$t_vat_id = "SELECT nextval('t_cust_acc_dtl_trans_seq') as t_cust_acc_dtl_trans_id";
							$da = $this->db->query($t_vat_id)->result();
				        	foreach ($da as $value) {
				        		$id_auto = $value->t_cust_acc_dtl_trans_id;
				        	}

				        	$bill = explode('-', $sql[1]);
				        	$temp_date = tgl_ind_to_eng($start_period);
				        	if ($temp_date != $sql[0]) {
				        		$code = 2;
				        		$message = 'Laporan masa pajak anda ini tidak sesuai dengan Laporan Rekapitulasi Penerimaan Harian. Cek kembali pemilihan masa pajak';
				        	}
				        	else{
				        		$dat = array(
									't_cust_acc_dtl_trans_id'=>$id_auto,
									't_cust_account_id'		=>$cust_account_id,
									'trans_date'			=>$sql[0],
									'bill_no'				=>$bill[0],
									'bill_no_end'			=>$bill[1],
									'bill_count'			=>$sql[2],
									'service_charge'		=>$sql[3],
									'service_desc'			=>$sql[4],
									'description'			=>$sql[4],
									'p_vat_type_dtl_id'		=>$vat_type_dtl,
									'creation_date'			=>date("Y-m-d H:i:s"),
									'created_by'			=>$npwd,
									'updated_date'			=>date("Y-m-d H:i:s"),
									'updated_by'			=>$npwd
								);
								$this->db->insert('t_cust_acc_dtl_trans', $dat);
				        	}
						}
					}

					$q = "SELECT * 
							FROM (
							SELECT
								a.t_cust_acc_dtl_trans_id,
								a.t_cust_account_id,
								a.trans_date,
								CAST( trans_date AS DATE ) AS trans_date_txt,
								to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
								a.bill_no,
								a.bill_no_end,
								a.bill_count,
								a.service_desc,
								a.service_charge,
								a.vat_charge,
								a.description,
								a.p_vat_type_dtl_id,
								a.p_vat_type_dtl_cls_id 
							FROM
								t_cust_acc_dtl_trans a 
							WHERE
								a.t_cust_account_id = '".$cust_account_id."' 
								) AS tbl
								LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
							WHERE
								p_vat_type_dtl_id = '".$vat_type_dtl."'
								AND p_finance_period_id = '".$periode."'
								AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
								AND '".$end_period."' 
							ORDER BY
								t_cust_acc_dtl_trans_id ASC";
					$query = $this->db->query($q)->result();
					$nilai_omset = 0;
					//$nilai_omset = $sql[3];
					$tabel = array();
					foreach ($query as $r) {
						$nilai_omset = $nilai_omset+$r->service_charge;
						$tabel[]=array(
							't_cust_acc_dtl_trans_id'=>$r->t_cust_acc_dtl_trans_id,
							'trans_date'		=>$r->trans_date_jqgrid,
							'bill_no'			=>$r->bill_no,
							'bill_no_end'		=>$r->bill_no_end,
							'bill_count'		=>$r->bill_count,
							'service_charge'	=>$r->service_charge,
							'service_desc'		=>$r->service_desc
						);
				    }
				    $nilai_pajak = 1;
					
					if ($limit_active == 'Y' and $sql[3] < $limit_restoran) {
				    	$pajak = 0;
				    	$denda = 0;
				    }
				    elseif ($limit_active == 'Y' and $klasifikasi == 'KATERING') {
				    	$pajak = ($sql[3] * $nilai_pajak) / 100;
				    	$denda = 0;
				    	$total_bayar = $pajak + $denda;
				    }
				    elseif ($vat_type_dtl == '11') {
				    	$pajak = ($nilai_omset * $nilai_pajak) / 100;
						$denda = 0;
						$total_bayar = $pajak + $denda;
				    }
				    else{
				    	$pajak = ($nilai_omset * $nilai_pajak) / 100;
						$kelipatan_denda = $booldendamonth;
						if($booldenda >= 0)
						{
							if($kelipatan_denda > 24) {
								$kelipatan_denda = 24;
							}
							$denda = 0.02 * $pajak * $kelipatan_denda;
							$total_bayar = $pajak + $denda;
						}
						else
						{
							$denda = 0;
							$total_bayar = $pajak + $denda;
						}
				    }

				    if ($temp_date != $sql[0]) {
				    	$code = 2;
				        $message = 'Laporan masa pajak anda ini tidak sesuai dengan Laporan Rekapitulasi Penerimaan Harian. Cek kembali pemilihan masa pajak';
				    }
				    else{
					    $d['vat_charge'] = $pajak;
						$this->db->where('t_cust_acc_dtl_trans_id', $id_auto);
						$this->db->update('t_cust_acc_dtl_trans', $d);
					}
					$da = array(
						//'t_cust_acc_dtl_trans_id'=>$id_auto,
						'nilai_omset' => $nilai_omset,
						'pajak' 	  => $pajak,
						'denda' 	  => $denda,
						'total_bayar' => $pajak + $denda
					);
					$data['hasil'] = $da;
					$data['tabel'] = $tabel;
				}
			}
			else{
				$code = 3;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 4;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);	
	}

	function transaksi_harian($token){
		$npwd   		   = $this->input->post('npwd');
		$cust_account_id   = $this->input->post('cust_account_id');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['cust_account_id'])) {
				$q = "SELECT
						'$npwd' AS npwd,
						t_cust_acc_dtl_trans.t_cust_account_id,
						SUM ( t_cust_acc_dtl_trans.service_charge ) AS jum_trans,
						SUM ( t_cust_acc_dtl_trans.vat_charge ) AS jum_pajak,
						t_cust_acc_dtl_trans.p_vat_type_dtl_id,
						t_vat_setllement.payment_key AS pay_key,
						t_payment_receipt.receipt_no AS kuitansi_pembayaran,
						p_finance_period.p_finance_period_id,
						p_finance_period.code,
						t_customer_order.p_order_status_id,
					CASE
						
						WHEN t_vat_setllement.start_period IS NULL THEN
						to_char( p_finance_period.start_date, 'yyyy-mm-dd' ) ELSE to_char( t_vat_setllement.start_period, 'yyyy-mm-dd' ) END AS start_period,
					CASE
							
						WHEN t_vat_setllement.end_period IS NULL THEN
							to_char( p_finance_period.end_date, 'yyyy-mm-dd' ) ELSE to_char( t_vat_setllement.end_period, 'yyyy-mm-dd' ) END AS end_period 
					FROM
						t_cust_acc_dtl_trans
						LEFT JOIN p_finance_period ON to_char( trans_date, 'YYYY-MM' ) = to_char( p_finance_period.start_date, 'YYYY-MM' )
						LEFT JOIN t_vat_setllement ON t_cust_acc_dtl_trans.t_cust_account_id = t_vat_setllement.t_cust_account_id 
						AND p_finance_period.p_finance_period_id = t_vat_setllement.p_finance_period_id
						LEFT JOIN t_customer_order ON t_customer_order.t_customer_order_id = t_vat_setllement.t_customer_order_id
						LEFT JOIN t_payment_receipt ON t_payment_receipt.t_vat_setllement_id = t_vat_setllement.t_vat_setllement_id 
					WHERE
						t_cust_acc_dtl_trans.t_cust_account_id = '".$cust_account_id."' 
						AND trans_date >=
						CASE
								
								WHEN t_vat_setllement.start_period IS NULL THEN
								p_finance_period.start_date ELSE t_vat_setllement.start_period 
							END 
								AND t_vat_setllement.payment_key IS NULL 
								AND trans_date <=
							CASE
									
								WHEN t_vat_setllement.end_period IS NULL THEN
								p_finance_period.end_date ELSE t_vat_setllement.end_period 
						END
						GROUP BY t_cust_acc_dtl_trans.t_cust_account_id, t_cust_acc_dtl_trans.p_vat_type_dtl_id, t_vat_setllement.payment_key, t_payment_receipt.receipt_no, p_finance_period.p_finance_period_id, t_customer_order.p_order_status_id, t_vat_setllement.start_period, t_vat_setllement.end_period, p_finance_period.code, p_finance_period.start_date, p_finance_period.end_date ORDER BY p_finance_period.code DESC LIMIT 1";
				$query = $this->db->query($q);
	        	//$row = $query->row_array();   
				$tabel = array();
				foreach($query->result_array() as $r){
					$tabel[]=array(
						'npwd' 					=>$r['npwd'],
						't_cust_account_id' 	=>$r['t_cust_account_id'],
						'code' 					=>$r['code'],
						'jum_pajak'				=>$r['jum_pajak'],
						'jum_trans'				=>$r['jum_trans'],
						'p_vat_type_dtl_id' 	=>$r['p_vat_type_dtl_id'],
						'kuitansi_pembayaran' 	=>$r['kuitansi_pembayaran'],
						'p_finance_period_id'	=>$r['p_finance_period_id'],
						'p_order_status_id'		=>$r['p_order_status_id'],
						'start_period'			=>tgl_eng_to_ind($r['start_period']),
						'end_period'			=>tgl_eng_to_ind($r['end_period'])
					);
				}
				$data['tabel'] = $tabel;
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function read_acc_trans($token){
		$periode 	 	 = $this->input->post('periode');
		$vat_type_dtl 	 = $this->input->post('vat_type_dtl');
		$cust_account_id = $this->input->post('cust_account_id');
		$start_period 	 = $this->input->post('start_period');
		$end_period   	 = $this->input->post('end_period');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if($token != ''){
			if(isset($_POST['start_period'])){
				$sql = "SELECT * 
						FROM (
						SELECT
							a.t_cust_acc_dtl_trans_id,
							a.t_cust_account_id,
							a.trans_date,
							CAST( trans_date AS DATE ) AS trans_date_txt,
							to_char ( trans_date, 'dd-mm-yyyy' ) AS trans_date_jqgrid,
							a.bill_no,
							a.bill_no_end,
							a.bill_count,
							a.service_desc,
							a.service_charge,
							a.vat_charge,
							a.description,
							a.p_vat_type_dtl_id,
							a.p_vat_type_dtl_cls_id 
						FROM
							t_cust_acc_dtl_trans a 
						WHERE
							a.t_cust_account_id = '".$cust_account_id."' 
							) AS tbl
							LEFT JOIN p_finance_period ON p_finance_period.start_date <= trans_date AND p_finance_period.end_date >= trans_date 
						WHERE
							p_vat_type_dtl_id = '".$vat_type_dtl."'
							AND p_finance_period_id = '".$periode."'
							AND CAST( trans_date AS DATE ) BETWEEN '".$start_period."' 
							AND '".$end_period."' 
						ORDER BY
							t_cust_acc_dtl_trans_id ASC";
	       		$data = $this->db->query($sql)->result();
			}else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';	
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function history_transaksi($token){
		$cust_account_id = $this->input->post('cust_account_id');
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if (isset($_POST['cust_account_id'])) {
				$sql = "SELECT
							d_camj.nama AS new_company_name,
							d_camj.masa_awal,
						CASE					
							WHEN d_vs.start_period IS NOT NULL THEN
							'Lunas' ELSE'Belum lunas' 
							END AS lunas,
							d_camj.masa_akhir,
							r_vtd.*,
							d_vs.t_vat_setllement_id,
							d_vs.t_customer_order_id,
							d_vs.t_cust_account_id,
							d_vs.start_period,
							d_vs.end_period,
							d_vs.p_vat_type_dtl_id,
							d_vs.payment_key AS payment_key_1,
							d_vs.payment_key AS payment_key_2,
							d_vs.is_surveyed,
							to_char(d_vs.settlement_date,'DD-MON-YYYY') tgl_pelaporan, 
							r_fp.code AS periode_pelaporan,
							d_vs.total_trans_amount AS total_transaksi,
							d_vs.total_vat_amount AS total_pajak,
							COALESCE ( d_vs.total_penalty_amount, 0 ) AS total_denda,
							CAST ( d_vs.start_period AS DATE ) AS c_start_period,
							CAST ( d_vs.end_period AS DATE ) AS c_end_period,
							date_part('day', d_vs.start_period) AS day_start_date,
							date_part('day', d_vs.end_period) AS day_end_date,
							date_part('month', d_vs.start_period) AS month_date,
							date_part('year', d_vs.start_period) AS year_date,
							d_vs.start_period AS periode_awal_laporan,
							d_vs.end_period AS periode_akhir_laporan,
							r_st.code AS type_code,
							d_vs.is_settled,
							COALESCE ( d_vs.debt_vat_amt, d_vs.total_vat_amount ) AS debt_vat_amt,
							COALESCE ( d_vs.db_increasing_charge, 0 ) AS db_increasing_charge,
							COALESCE ( d_vs.debt_vat_amt, d_vs.total_vat_amount ) + COALESCE ( d_vs.db_increasing_charge, 0 ) + COALESCE ( d_vs.db_interest_charge, 0 ) + COALESCE ( d_vs.total_penalty_amount, 0 ) AS total_hrs_bayar,
							COALESCE ( d_vs.db_increasing_charge, 0 ) AS kenaikan_1,
							COALESCE ( d_vs.db_interest_charge, 0 ) AS kenaikan_2,
							d_vs.p_vat_type_dtl_id AS ref_vat_type_dtl_id_2,
							d_vs.no_kohir,
							d_vs.due_date AS jatuh_tempo,
							d_vs.settlement_date,
							( SELECT d_rp.receipt_no AS kuitansi_pembayaran FROM t_payment_receipt d_rp WHERE d_vs.t_vat_setllement_id = d_rp.t_vat_setllement_id ) AS kuitansi_pembayaran 
						FROM
							t_vat_setllement d_vs
							JOIN p_finance_period r_fp ON d_vs.p_finance_period_id = r_fp.p_finance_period_id
							JOIN p_settlement_type r_st ON d_vs.p_settlement_type_id = r_st.p_settlement_type_id
							LEFT JOIN p_vat_type_dtl r_vtd ON r_vtd.p_vat_type_dtl_id = d_vs.p_vat_type_dtl_id
							LEFT JOIN t_cust_acc_masa_jab d_camj ON d_camj.t_cust_account_id = d_vs.t_cust_account_id 
							AND masa_awal <= d_vs.settlement_date 
						AND
						CASE					
								WHEN masa_akhir IS NULL THEN
							TRUE 
								WHEN masa_akhir >= d_vs.settlement_date THEN
								masa_akhir >= d_vs.settlement_date 
							END 
							WHERE
								d_vs.t_cust_account_id = '$cust_account_id' 
						ORDER BY
						d_vs.t_vat_setllement_id DESC";
		        $data = $this->db->query($sql)->result();  
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';	
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);
	}

	function submit_lpaoran($token){
		$dat_cust_account_id = $_POST['dat_cust_account_id'];
		$npwd 				 = $_POST['npwd'];
		$ref_finance_period_id = $_POST['periode'];
		$ref_vat_type_dtl_id = $_POST['vat_type_dtl'];
		$vat_pct 			 = $_POST['vat_pct'];
		if ($_POST['klasifikasi'] == 'KATERING') {
			$ref_vat_type_dtl_ids = 11;
		}
		else {
			$ref_vat_type_dtl_ids = $vat_pct;
		}
		$ref_vat_type_dtl_cls_id = $ref_vat_type_dtl_ids;
		$start_period  	 		 = $_POST['awal'];
		$end_period  	 		 = $_POST['akhir'];
		$total_amount  	 		 = $_POST['total'];
		$total_trans_amount		 = $_POST['omset'];
		$total_vat_amount		 = $_POST['pajak'];
		$penalty_amount			 = $_POST['denda'];
		$percentage				 = $total_vat_amount / $total_trans_amount * 100;
		$code = 1;
		$message = 'Berhasil';
		$data = array();
		if ($token != '') {
			if(isset($_POST['dat_cust_account_id'])){
				$items[] = array(
					'user_name' 				=> $npwd,
					'npwd' 						=> $npwd,
					't_cust_accounts_id' 		=> $dat_cust_account_id,
					'finance_period' 			=> $ref_finance_period_id,
					'p_vat_type_dtl_id' 		=> $ref_vat_type_dtl_id,
					'p_vat_type_dtl_cls_id' 	=> $ref_vat_type_dtl_cls_id,
					'start_period' 				=> $start_period,
					'end_period' 				=> $end_period,
					'total_trans_amount' 		=> $total_trans_amount,
					'total_vat_amount' 			=> $total_vat_amount
				);

				$jsonItems  = json_encode($items);
				$item 		= json_decode($jsonItems);

				$q 	= " select vat_type_dtl.* ";
				$q .= " FROM sikp.p_vat_type_dtl vat_type_dtl";
				$q .= " WHERE p_vat_type_dtl_id = ". $ref_vat_type_dtl_id;
				$q = $this->db->query($q);
				$result = $q->result_array();

				$items = $item[0];
        		$data  = array('items' => array(), 'total' => 0, 'success' => true, 'message' => '');

        		$user_name = $npwd;
        		if(empty($items->p_vat_type_dtl_cls_id)){
                	$items->p_vat_type_dtl_cls_id = 'null';
	            }
	            else {
	                $items->p_vat_type_dtl_cls_id = 'null';
	            }
	             $sql = "select o_mess,o_pay_key,o_cust_order_id,o_vat_set_id from f_vat_settlement_manual_wp( ". $items->t_cust_accounts_id ." ,".$items->finance_period.",'".$items->npwd."','".$items->start_period."','".$items->end_period."',null,".$items->total_trans_amount.",".$items->total_vat_amount.",".$items->p_vat_type_dtl_id.",".$items->p_vat_type_dtl_cls_id.", '".$user_name."')";
	            $messageq 	  = $this->db->query($sql);
				$message 	  = $messageq->result_array();
				$messagefinal = $message;
	            $sql = "select * from f_get_penalty_amt(".$items->total_vat_amount.",".$items->finance_period.",".$items->p_vat_type_dtl_id.");";
	            $q = $this->db->query($sql);
				$penalty = $q->row_array();

				if($message[0]['o_vat_set_id'] == null ||empty($message[0]['o_vat_set_id'])){
                $data['success'] = false;
	            }
	            else{
					$params = json_encode(array(
								't_vat_setllement_id'=>$message[0]['o_vat_set_id'],
								't_customer_order_id'=>$message[0]['o_cust_order_id']
							));

					$data['success'] = false;
					$user_name = $ci->session->userdata('user_name');

	                $sql = "select sikp.f_before_submit_sptpd_wp(".$message[0]['o_vat_set_id'].",'".$user_name."')";
	                $messageq = $table->db->query($sql);
					$message1 = $messageq->row_array();

					if(true){
	                    $sql="select o_result_msg AS o_mess from sikp.f_first_submit_engine(501,".$message[0]['o_cust_order_id'].",'".$user_name."')";

	                    $messageq = $table->db->query($sql);
						$message1 = $messageq->row_array();
	                    if($message1=='OK'){
	                        $sql="select f_gen_vat_dtl_trans(".$message[0]['o_vat_set_id'].",'".$user_name."')";
							$messageq = $table->db->query($sql);
							$message1 = $messageq->result_array();
							$data['success'] = true;
	                    }else {
							$data['success'] = false;
							$data['items'] = array();
							$data['message'] = $message1;
							echo json_encode($data);
							exit;
						}
	                }
					$data['items'] = $messagefinal[0];
					$data['message'] = $messagefinal[0]['o_mess'];
					echo json_encode($data);
					exit;
	            }	
	            $data['items'] = $message[0];
            	$data['message'] = $message[0]['o_mess'];			
			}
			else{
				$code = 2;
				$message = 'Parameter Tidak Lengkap';
			}
		}
		else{
			$code = 3;
			$message = 'Token Not Valid';
		}
		$respons = array(
			'code'=>$code,
			'message'=>$message,
			'data'=>$data
		);
		echo json_encode($respons);		
	}
}
