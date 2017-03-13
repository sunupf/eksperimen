<?php namespace App\Http\Controllers;

use Auth;
use Hash;
use Mail;
use App\User;
use Validator;
use Session;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UpdateAvatarRequest;
use App\Http\Requests\resendActivationRequest;
use Illuminate\Routing\Controller;

class UsersController extends Controller {
  public function save(RegisterRequest $request){
    $user = new User($request->except(['_token','password']));
    $user->password = Hash::make($request->password);
    $user->active = "0";
    $user->activation_code = Hash::make($request->email.$request->password.date("Ymdhis"));

    $data = array(
      'to' => $user->email,
      'link' => route('userActivation',array('email'=>$request->email,'code'=>urlencode($user->activation_code)))
    );

    if($user->save()){
      Mail::send('email.activation',$data, function($message) use ($data){
        $message->to($data['to'])->subject('Account Activation');
      });

      return redirect()->back()
          ->with('status',true)
          ->with('message','Your account has been created and activation link already send to your email');
    }else{
      return redirect()->back()
          ->withInput($request->except('password'))
          ->with('status',false)
          ->with('message','Something wrong happened, please re-submit your registration.');
    }
  }

  public function activate(Request $request, $email, $code){
    $decodedCode = urldecode($code);
    $count = User::where('email',$email)->count();
    if($count===1){
      $user = User::where('email',$email)->first();
      if($decodedCode==$user->activation_code && $user->active === 0){
        $user->active = 1;
        $user->save();
        return view('activation');
      }else{
        return view('activation');
      }
    }
  }

  public function profile(){
    $data['user'] = User::find(Auth::user()->id);
    $data['todos'] = User::find(Auth::user()->id)->todos;
    return view('profile',$data);
  }
  //TODO : Show notification on Profile Update

  public function profileUpdate(UpdateProfileRequest $request, $id){
    $user = User::find(Auth::user()->id);
    $data['user'] = $user;
    $user->name = $request->name;
    if($request->birthday){
      $user->birthday = date("Y-m-d",strtotime($request->birthday));
    }else{
      $user->birthday = "NULL";
    }
    $user->about = $request->about;
    $user->password = Hash::make($request->password);
    if($request->password != ""){
      // $validation = Validator::make($request->except('_token'), [
      //     'password' => 'min:8'
      // ]);
      // if ($validation->fails()){
      //   return response()->json([
      //       'errors' => $validation->errors()
      //     ],500);
      // }else{
      // }
    }

    // $data['todos'] = $user->todos;
    if($user->update()){
      return redirect()->back()
          ->with('status',true)
          ->with('message','Your account has been updated');
    }else{
      return redirect()->back()
          ->withInput($request->except('password'))
          ->with('status',false)
          ->with('message','Something wrong happened, please re-submit your submission.');
    }
  }

  public function avatarUpdate(Request $request){
    $validator = Validator::make($request->except('_token'),[
      'user-avatar'=> 'required|mimes:jpg,jpeg,png,gif,bmp|max:1000'
    ]);

    if($validator->fails()){
      Session::flash('avatar', true);
      return redirect("profile")
        ->with('avatar',true)
        ->with('errors',$validator->errors());
    }else{
      $destinationPath = "avatars/";
      $file = $request->file('user-avatar');
      $fileName = $file->getClientOriginalName();
      if ($file->isValid()){
        try{
          $save = $file->move($destinationPath,$fileName);
          $user = User::find(Auth::user()->id);
          $user->avatar = $destinationPath.$save->getFileName();

          if($user->update()){
            return redirect("profile")->with('avatar','Avatar has been updated');
          }else{
            return redirect("profile")->with('avatar','Avatar could not updated');
          }
        }catch(Exception $e){
          return redirect("profile")->with('avatar','Avatar could not updated');
        }
      }else{

      }
    }
  }

  public function resendActivation(resendActivationRequest $request){
    $rows = User::where("email","=",$request->email);

    if($rows->count() === 1){
      $user = $rows->first();
      if($user->active === 1){
        $data = array(
          'to' => $user->email,
          'link' => route('userActivation',array('email'=>$request->email,'code'=>urlencode($user->activation_code)))
        );

        Mail::send('email.activation',$data, function($message) use ($data){
          $message->to($data['to'])->subject('Account Activation');
        });

        return redirect()->back()
            ->with('status',true)
            ->with('message',"Activation email has been resend, please check your email");
      }else{
        return redirect()->back()
            ->withInput($request->except(['password']))
            ->with('status',false)
            ->with('message',"Your account already activated, you can login without activate it again by clicking <a href='".route('root')."'>here</a>");
      }
    }else if($rows->count() < 1){
      return redirect()->back()
          ->withInput($request->except(['password']))
          ->with('status',false)
          ->with('message',"We could not found your account, You can register if you don't have any account by clicking <a href='".route('register')."'>here</a>");
    }else{
      return redirect()->back()
          ->with('status',false)
          ->with('message',"Something wrong happened, please re-submit your email.");
    }
  }
}
