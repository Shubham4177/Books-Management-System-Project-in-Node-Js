$(document).ready(function(){
    $.getJSON('/books/fetch_all_subjects',function(data){
      data.map((item)=>{
        $('#subject').append($('<option>').text(item.subjectname).val(item.subjectid))
      })
    })

    $('#subject').change(function(){
        $.getJSON('/books/fetch_all_title',{subjectid:$('#subject').val()},function(data){

            $('#title').empty()
            $('#title').append($('<option>').text('-Select Title-'))
            data.map((item)=>{

                $('#title').append($('<option>').text(item.titlename).val(item.titleid))   
            })
        })
    })
})