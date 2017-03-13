require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => '.uk-form' }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      element = @driver.find_element :css => ".container #{key}"
      if(key === "[name='birthday']")
        data = input.split "-"
        if(data.length === 3 || data.length === 0)
          element.clear
        end
      elsif
        element.clear
      end
      element.send_keys input
    end

    buttonSubmit = @driver.find_element :css => ".profile-data .uk-button-primary"
    buttonSubmit.click
    # #
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => ".uk-alert" }

    respons = @driver.find_elements :css => ".uk-alert.uk-alert-success"

    if(respons.empty?)
      respons = @driver.find_elements :css => ".uk-alert .uk-list > li"
    end

    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end

    expect = @testCase['messages']

    puts expect
    puts "///"
    puts result

    return Set.new(expect) === Set.new(result)
  end
end
