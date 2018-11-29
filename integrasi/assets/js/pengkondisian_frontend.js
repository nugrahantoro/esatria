$(function(){


$jenis_ijin = $("#processname").val();
$jenis_layanan = $("#processcategory").val();



//------------------------------------ PERIZINAN BARU IG ----------------------------------------//

if ($jenis_ijin=="izin_gangguan_01" && $jenis_layanan=="perijinan_baru") {
//alert ("IG");

		// lookup pengkondisian bentuk perusahaan
		$("#bentuk_perusahaan").change(function(){
		
		$nilainya = $( "#bentuk_perusahaan" ).val();
		
		if ($nilainya==1) {
		  
		  $("#kondisilampiran_lampiran8").hide();
		  $("#kondisitext_no_lampiran8").hide();
		  $("#no_lampiran8").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran66").hide();
		  $("#lampiran66").hide();
		  $("#lampiran66").prop('disabled', true);
		  
		  }
		else if ($nilainya==3) {
		  
		  $("#kondisilampiran_lampiran66").show();
		  $("#lampiran66").show();
		  $("#lampiran66").prop('disabled', false);
		  
		  } else {
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#kondisitext_no_lampiran8").show();
		  $("#no_lampiran8").prop('disabled', false);
		  
		  $("#kondisilampiran_lampiran66").hide();
		  $("#lampiran66").hide();
		  $("#lampiran66").prop('disabled', true);
		  
		  }
		  
		});
		
		// lookup pengkondisian status tanah
  
		$("#status_tanah").change(function(){

		$nilainya = $( "#status_tanah" ).val();
		if ($nilainya==02) {
		
		  $("#kondisilampiran_lampiran39").hide();
		  $("#lampiran39").prop('disabled', true);
			
		  } else {
		  
		  $("#kondisilampiran_lampiran39").show();
		  $("#lampiran39").prop('disabled', false);
		  
		  }
		  
		});



}








//------------------------------------ PERIZINAN BARU TDP ----------------------------------------//

if ($jenis_ijin=="tanda_daftar_perusahaan_01" && $jenis_layanan=="perijinan_baru") {
//alert ("TDP");
		// lookup pengkondisian bentuk perusahaan
		$("#bentuk_perusahaan").change(function(){

		$nilainya = $( "#bentuk_perusahaan" ).val();
		  
		  if ($nilainya==1) {
		  
		  $("#kondisilampiran_lampiran8").hide();
		  $("#kondisitext_no_lampiran8").hide();
		  $("#no_lampiran8").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran66").hide();
		  $("#kondisitext_no_lampiran66").hide();
		  $("#no_lampiran66").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran22").hide();
		  $("#kondisitext_no_lampiran22").hide();
		  $("#no_lampiran22").prop('disabled', true);
			
		  } 
		  
		  else if ($nilainya==2) {
		  
		  $("#kondisilampiran_lampiran66").hide();
		  $("#kondisitext_no_lampiran66").hide();
		  $("#no_lampiran66").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran22").hide();
		  $("#kondisitext_no_lampiran22").hide();
		  $("#no_lampiran22").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#kondisitext_no_lampiran8").show();
		  $("#no_lampiran8").prop('disabled', false);
		  
		  }
		  
		  else if ($nilainya==4) {
		  
		  $("#kondisilampiran_lampiran66").hide();
		  $("#kondisitext_no_lampiran66").hide();
		  $("#no_lampiran66").prop('disabled', true);
		  
		   $("#kondisilampiran_lampiran22").show();
		  $("#kondisitext_no_lampiran22").show();
		  $("#no_lampiran22").prop('disabled', false);
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#kondisitext_no_lampiran8").show();
		  $("#no_lampiran8").prop('disabled', false);
		  
		  }
		  
		  
		  else {
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#kondisitext_no_lampiran8").show();
		  $("#no_lampiran8").prop('disabled', false);
		  
		  
		  $("#kondisilampiran_lampiran66").show();
		  $("#kondisitext_no_lampiran66").show();
		  $("#no_lampiran66").prop('disabled', false);
		  
		  $("#kondisilampiran_lampiran22").show();
		  $("#kondisitext_no_lampiran22").show();
		  $("#no_lampiran22").prop('disabled', false);
		  
		  
		  }


		  
		});

}


//------------------------------------ PERIZINAN BARU TDG ----------------------------------------//

if ($jenis_ijin=="tanda_daftar_gudang_01" && $jenis_layanan=="perijinan_baru") {
//alert ("TDG");

		// lookup pengkondisian bentuk perusahaan
		$("#bentuk_perusahaan").change(function(){
		
		$nilainya = $( "#bentuk_perusahaan" ).val();
		
		if ($nilainya==1) {
		  
		  $("#kondisilampiran_lampiran8").hide();
		  $("#kondisitext_no_lampiran8").hide();
		  $("#no_lampiran8").prop('disabled', true);
		  
		  } else {
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#kondisitext_no_lampiran8").show();
		  $("#no_lampiran8").prop('disabled', false);
		  
		  }
		  
		});
		
		


}


//------------------------------------ PERIZINAN BARU IUP ----------------------------------------//

if ($jenis_ijin=="izin_usaha_perdagangan_01" && $jenis_layanan=="perijinan_baru") {
//alert ("IUG");

		// lookup pengkondisian bentuk perusahaan
		$("#bentuk_perusahaan").change(function(){
		
		$nilainya = $( "#bentuk_perusahaan" ).val();
		
		if ($nilainya==1) {
		  
		  $("#kondisilampiran_lampiran8").hide();
		  $("#lampiran8").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran49").hide();
		  $("#lampiran49").prop('disabled', true);
		  
		  $("#kondisilampiran_lampiran66").hide();
		  $("#lampiran66").prop('disabled', true);
		  
		  } else {
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#lampiran8").prop('disabled', false);
		  
		  $("#kondisilampiran_lampiran49").show();
		  $("#lampiran49").prop('disabled', false);
		  
		  $("#kondisilampiran_lampiran66").show();
		  $("#lampiran66").prop('disabled', false);
		  
		  }
		  
		});
		
		


}



//------------------------------------ PERIZINAN BARU IUI ----------------------------------------//

if ($jenis_ijin=="izin_usaha_industri_01" && $jenis_layanan=="perijinan_baru") {
//alert ("IUI");

		// lookup pengkondisian bentuk perusahaan
		$("#bentuk_perusahaan").change(function(){
		
		$nilainya = $( "#bentuk_perusahaan" ).val();
		
		if ($nilainya==1) {
		  
		  $("#kondisilampiran_lampiran8").hide();
		  $("#lampiran8").prop('disabled', true);
		  
		  
		  
		  } else {
		  
		  $("#kondisilampiran_lampiran8").show();
		  $("#lampiran8").prop('disabled', false);
		  
		  
		  
		  }
		  
		});
		
		


}




// lookup pengkondisian jenis pemohon
  
$("#jenis_pemohon").change(function(){

$nilainya = $( "#jenis_pemohon" ).val();
   //alert($nilainya);
  
   if ($nilainya==1) {
  
  $("#kondisilabel_data_perusahaan").hide();
  $("#kondisitext_nama_perusahaan").hide();
  $("#kondisilabel_alamat_perusahaan").hide();  
  $("#kondisitext_alamat_jalan_perusahaan").hide();
  $("#kondisitext_alamat_no_perusahaan").hide();
  $("#kondisitext_alamat_rt_perusahaan").hide();
  $("#kondisitext_alamat_rw_perusahaan").hide();
  $("#kondisicombo_jenis_usaha").hide();
  $("#kondisicombo_jenis_usaha_sub").hide();
  $("#kondisicombo_bentuk_perusahaan").hide();
  $("#kondisicombo_status_perusahaan").hide();  
  $("#kondisicombo_alamat_perusahaan_prov").hide();
  $("#kondisicombo_alamat_perusahaan_kabkot").hide();
  $("#kondisicombo_alamat_perusahaan_kec").hide();
  $("#kondisicombo_alamat_perusahaan_kel").hide();
  
  $("#nama_perusahaan").prop('disabled', true);
  $("#alamat_jalan_perusahaan").prop('disabled', true);
  $("#alamat_no_perusahaan").prop('disabled', true);
  $("#alamat_rt_perusahaan").prop('disabled', true);
  $("#alamat_rw_perusahaan").prop('disabled', true);
  $("#jenis_usaha").prop('disabled', true);
  $("#jenis_usaha_sub").prop('disabled', true);
  $("#bentuk_perusahaan").prop('disabled', true);
  $("#status_perusahaan").prop('disabled', true);  
  $("#alamat_perusahaan_prov").prop('disabled', true);
  $("#alamat_perusahaan_kabkot").prop('disabled', true);
  $("#alamat_perusahaan_kec").prop('disabled', true);
  $("#alamat_perusahaan_kel").prop('disabled', true);
  
  
  
  } else {
  
  
  
  
  
  $("#kondisilabel_data_perusahaan").show();
  $("#kondisitext_nama_perusahaan").show();
  $("#kondisilabel_alamat_perusahaan").show();  
  $("#kondisitext_alamat_jalan_perusahaan").show();
  $("#kondisitext_alamat_no_perusahaan").show();
  $("#kondisitext_alamat_no_perusahaan").show();
  $("#kondisitext_alamat_rt_perusahaan").show();
  $("#kondisitext_alamat_rw_perusahaan").show();
  $("#kondisicombo_jenis_usaha").show();
  $("#kondisicombo_jenis_usaha_sub").show();
  $("#kondisicombo_bentuk_perusahaan").show();
  $("#kondisicombo_status_perusahaan").show();
  $("#kondisicombo_alamat_perusahaan_prov").show();
  $("#kondisicombo_alamat_perusahaan_kabkot").show();
  $("#kondisicombo_alamat_perusahaan_kec").show();
  $("#kondisicombo_alamat_perusahaan_kel").show();
  
  $("#nama_perusahaan").prop('disabled', false);
  $("#alamat_jalan_perusahaan").prop('disabled', false);
  $("#alamat_no_perusahaan").prop('disabled', false);
  $("#alamat_rt_perusahaan").prop('disabled', false);
  $("#alamat_rw_perusahaan").prop('disabled', false);
  $("#jenis_usaha").prop('disabled', false);
  $("#jenis_usaha_sub").prop('disabled', false);
  $("#bentuk_perusahaan").prop('disabled', false);
  $("#status_perusahaan").prop('disabled', false);  
  $("#alamat_perusahaan_prov").prop('disabled', false);
  $("#alamat_perusahaan_kabkot").prop('disabled', false);
  $("#alamat_perusahaan_kec").prop('disabled', false);
  $("#alamat_perusahaan_kel").prop('disabled', false);
  
  }

 //$("#kondisilampiran_lampiran5").hide();
  //$("#no_lampiran5").hide();
  
});
















});