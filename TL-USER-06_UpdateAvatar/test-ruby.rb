require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => '#avatar' }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      element = @driver.find_element :css => "#avatar #{key}"
      element.clear
      if input != ""
        path = File.join(Dir.pwd(),input);
        file_path_windows = path.gsub("/","\\")
      else
        file_path_windows = input
      end
      puts file_path_windows
      element.send_keys file_path_windows
    end

    buttonSubmit = @driver.find_element :css => "#avatar .uk-button-primary"
    buttonSubmit.click
    # #
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => "#avatar .uk-alert" }

    respons = @driver.find_elements :css => "#avatar .uk-alert.uk-alert-success"

    if(respons.empty?)
      respons = @driver.find_elements :css => "#avatar .uk-alert .uk-list > li"
    end

    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end

    expect = @testCase['messages']

    return Set.new(expect) === Set.new(result)
  end
end
